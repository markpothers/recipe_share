/* eslint-disable @typescript-eslint/no-var-requires */
import { useCallback, useRef, useState, useEffect } from "react";
import { Alert } from "react-native";

type SpeechRecognitionCallback = (speechResult: string, isFinished: boolean) => void;

interface SpeechStartOptions {
	lang: string;
	interimResults: boolean;
	continuous: boolean;
	maxAlternatives: number;
}

interface SpeechModule {
	ExpoSpeechRecognitionModule: {
		addListener: (event: string, callback: (data?: unknown) => void) => { remove: () => void };
		requestPermissionsAsync: () => Promise<{ granted: boolean }>;
		start: (options: SpeechStartOptions) => void;
		stop: () => void;
	};
}

// Dynamic module loading with proper error handling
let speechModule: SpeechModule | null = null;

try {
	// Try to load the speech recognition module
	// eslint-disable-next-line
	speechModule = require("expo-speech-recognition") as SpeechModule;
} catch {
	// Module not available in Expo Go
	speechModule = null;
}

/**
 * Speech-to-text hook with conditional implementation.
 * 
 * In development builds: Uses full speech recognition
 * In Expo Go: Shows helpful alert and provides fallback behavior
 */
export const useSpeechToText = () => {
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const speechResultCallback = useRef<SpeechRecognitionCallback | undefined>(undefined);
	// Setup event listeners when module is available
	useEffect(() => {
		if (!speechModule) return;

		const startListener = speechModule.ExpoSpeechRecognitionModule.addListener("start", () => {
			setIsRecording(true);
		});

		const endListener = speechModule.ExpoSpeechRecognitionModule.addListener("end", () => {
			setIsRecording(false);
			if (speechResultCallback.current) {
				speechResultCallback.current("", true);
			}
		});
		const resultListener = speechModule.ExpoSpeechRecognitionModule.addListener("result", (event: { results: Array<{ transcript: string }>; isFinal: boolean }) => {
			if (speechResultCallback.current && event.results && event.results.length > 0) {
				const transcript = event.results[0]?.transcript || "";
				speechResultCallback.current(transcript, event.isFinal || false);
			}
		});

		const errorListener = speechModule.ExpoSpeechRecognitionModule.addListener("error", () => {
			setIsRecording(false);
			if (speechResultCallback.current) {
				speechResultCallback.current("", true);
			}
		});

		// Cleanup listeners
		return () => {
			startListener?.remove();
			endListener?.remove();
			resultListener?.remove();
			errorListener?.remove();
		};
	}, []);

	const showExpoGoFallbackAlert = () => {
		Alert.alert(
			"Voice Recognition in Expo Go",
			"Speech-to-text requires a development build to work. In Expo Go, please type your input manually.\n\nTo test voice features, create a development build with:\neas build --profile development --platform android",
			[{ text: "OK" }]
		);
	};
	const endSpeechToText = useCallback(() => {
		if (speechModule?.ExpoSpeechRecognitionModule) {
			speechModule.ExpoSpeechRecognitionModule.stop();
		}
		setIsRecording(false);
		if (speechResultCallback.current) {
			speechResultCallback.current("", true);
		}
	}, []);

	const startSpeechToText = useCallback(async (callback: SpeechRecognitionCallback) => {
		speechResultCallback.current = callback;
		
		// If speech recognition module is not available (Expo Go), show alert and fail gracefully
		if (!speechModule?.ExpoSpeechRecognitionModule) {
			showExpoGoFallbackAlert();
			if (speechResultCallback.current) {
				speechResultCallback.current("", true);
			}
			return;
		}

		try {
			// Request permissions first
			const result = await speechModule.ExpoSpeechRecognitionModule.requestPermissionsAsync();
			if (!result.granted) {
				// Permissions not granted - silently fail
				if (speechResultCallback.current) {
					speechResultCallback.current("", true);
				}
				return;
			}

			// Start speech recognition
			speechModule.ExpoSpeechRecognitionModule.start({
				lang: "en-US",
				interimResults: true,
				continuous: false,
				maxAlternatives: 1,
			});
		} catch {
			// Handle start error silently
			setIsRecording(false);
			if (speechResultCallback.current) {
				speechResultCallback.current("", true);
			}
		}
	}, []);

	return {
		isRecording,
		startSpeechToText,
		endSpeechToText,
	};
};
