import Voice, { SpeechEndEvent, SpeechResultsEvent } from "@react-native-voice/voice";
import { useCallback, useEffect, useRef, useState } from "react";

// import { Audio } from "expo-av";

type SpeechRecognitionCallback = (speechResult: string, isFinished: boolean) => void;

let timeout: NodeJS.Timeout;
const INITIAL_DELAY = 3000;
const ContinueDelay = 1500;

export const useSpeechToText = () => {
	// const [hasRecordPermission, setHasRecordPermission] = useState<boolean>(false);
	const [isRecording, setIsRecording] = useState<boolean>(false);
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

	const onSpeechPartialResultsHandler = useCallback((event: SpeechResultsEvent) => {
		// console.log("Voice.onSpeechPartialResultsHandler:", event);
		// console.log("onSpeechPartialResultsHandler callback:", speechResultCallback);
		if (speechResultCallback.current && event.value && event.value.length > 0) {
			speechResultCallback.current(event.value[0], false);
		}
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(endSpeechToText, ContinueDelay);
	}, []);

	// android calls this on silence but ios does not so is handled with the backup timer
	const onSpeechEndHandler = useCallback((event: SpeechEndEvent) => {
		// console.log("Voice.onSpeechEnd:", event);
		// console.log("onSpeechPartialResultsHandler callback:", speechResultCallback);
		if (speechResultCallback.current) {
			speechResultCallback.current("", true);
		}
	}, []);

	// const onSpeechResultsHandler = useCallback((event: SpeechResultsEvent) => {
	// console.log("Voice.onSpeechResults:", event);
	// console.log("onSpeechResultsHandler callback:", speechResultCallback);
	// if (speechResultCallback.current && event.value && event.value.length > 0) {
	// speechResultCallback.current(event.value[0], true);
	// }
	// }, []);

	useEffect(() => {
		checkPermission();
		// const services = Voice.getSpeechRecognitionServices();
		// console.log("services:", services);
		// Voice.onSpeechStart = startHandler;
		// Voice.onSpeechRecognized = onSpeechRecognizedHandler;
		Voice.onSpeechPartialResults = onSpeechPartialResultsHandler;
		Voice.onSpeechEnd = onSpeechEndHandler;
		// Voice.onSpeechResults = onSpeechResultsHandler;
	}, [onSpeechEndHandler, onSpeechPartialResultsHandler]);

	const endSpeechToText = () => {
		// console.log("stop recording");
		Voice.stop();
		if (speechResultCallback.current) {
			speechResultCallback.current("", true);
		}
	};

	const startSpeechToText = useCallback((callback: SpeechRecognitionCallback) => {
		// setSpeechResultCallback(callback);
		speechResultCallback.current = callback;
		// console.log("speech recognition started");
		// console.log("hasRecordPermission:", hasRecordPermission);
		setIsRecording(true);
		Voice.start("en-US").then(() => {
			timeout = setTimeout(() => endSpeechToText, INITIAL_DELAY);
		});
	}, []);

	return {
		// hasRecordPermission,
		isRecording,
		startSpeechToText,
		endSpeechToText,
		// speechResult,
	};
};
