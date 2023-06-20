import { useState, useEffect, useRef } from "react";
// import { Audio } from "expo-av";
import Voice, {
	// SpeechRecognizedEvent,
	SpeechResultsEvent,
	// SpeechStartEvent,
	SpeechEndEvent,
} from "@react-native-voice/voice";

type SpeechRecognitionCallback = (speechResult: string, isFinished: boolean) => void

export const useSpeechToText = () => {
	// const [hasRecordPermission, setHasRecordPermission] = useState<boolean>(false);
	const [isRecording, setIsRecording] = useState<boolean>(false)
	// const [speechResult, setSpeechResult] = useState<string>("");
	// const [speechResultCallback, setSpeechResultCallback] = useState<(speechResult: string) => void>();
	const speechResultCallback = useRef<SpeechRecognitionCallback>();

	const checkPermission = async () => {
		// const hasPermission = await Audio.requestPermissionsAsync();
		// console.log("hasPermission:", hasPermission);
		// const voiceIsAvailable = await Voice.isAvailable();
		// console.log("voiceIsAvailable:", voiceIsAvailable);
	};

	// const startHandler = (event: SpeechStartEvent) => {
		// console.log("Voice.onSpeechStart:", event);
	// };

	// const onSpeechRecognizedHandler = (event: SpeechRecognizedEvent) => {
		// console.log("Voice.onSpeechRecognized:", event);
	// };

	const onSpeechPartialResultsHandler = (event: SpeechResultsEvent) => {
		// console.log("Voice.onSpeechPartialResultsHandler:", event);
		// console.log("onSpeechPartialResultsHandler callback:", speechResultCallback);
		if (speechResultCallback.current && event.value && event.value.length > 0) {
			speechResultCallback.current(event.value[0], false);
		}
	};

	const onSpeechEndHandler = (event: SpeechEndEvent) => {
		// console.log("Voice.onSpeechEnd:", event);
		// console.log("onSpeechPartialResultsHandler callback:", speechResultCallback);
		if (speechResultCallback.current) {
			speechResultCallback.current("", true);
		}
		};

	const onSpeechResultsHandler = (event: SpeechResultsEvent) => {
		// console.log("Voice.onSpeechResults:", event);
		// console.log("onSpeechResultsHandler callback:", speechResultCallback);
		if (speechResultCallback.current && event.value && event.value.length > 0) {
			speechResultCallback.current(event.value[0], true);
		}
	};

	useEffect(() => {
		checkPermission();
		// const services = Voice.getSpeechRecognitionServices();
		// console.log("services:", services);
		// Voice.onSpeechStart = startHandler;
		// Voice.onSpeechRecognized = onSpeechRecognizedHandler;
		Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
		Voice.onSpeechEnd = onSpeechEndHandler;
		Voice.onSpeechResults = onSpeechResultsHandler;
	}, []);

	const startSpeechToText = (callback: SpeechRecognitionCallback) => {
		// setSpeechResultCallback(callback);
		speechResultCallback.current = callback
		// console.log("speech recognition started");
		// console.log("hasRecordPermission:", hasRecordPermission);
		setIsRecording(true);
		Voice.start("en-US");
	};

	const endSpeechToText = () => {
		// console.log("stop recording");
		Voice.stop();
	};

	return {
		// hasRecordPermission,
		isRecording,
		startSpeechToText,
		endSpeechToText,
		// speechResult,
	};
};
