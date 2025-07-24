import { act, fireEvent, render } from "@testing-library/react-native";

import OfflineMessage from "./offlineMessage";
import React from "react";

describe("OfflineMessage", () => {
	let mockClearOfflineMessage;
	let mockAction;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		mockClearOfflineMessage = jest.fn();
		mockAction = jest.fn();
	});

	test("renders and closes itself after a timeout with the default time", async () => {
		render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Sorry, you can't do that right now, you appear to be offline"}
				action={mockAction}
				topOffset={"10%"}
			/>
		);
		expect(mockClearOfflineMessage).toHaveBeenCalledTimes(0);
		await act(async () => await jest.runAllTimers());
		expect(mockClearOfflineMessage).toHaveBeenCalledTimes(1);
	});

	test("renders and closes itself after a timeout with a specified delay", async () => {
		render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Sorry, you can't do that right now, you appear to be offline"}
				action={mockAction}
				topOffset={"10%"}
				delay={10000}
			/>
		);
		expect(mockClearOfflineMessage).toHaveBeenCalledTimes(0);
		await act(async () => await jest.runAllTimers());
		expect(mockClearOfflineMessage).toHaveBeenCalledTimes(1);
	});

	test("renders with an action button", () => {
		const { toJSON, getAllByRole, getByText } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Sorry, you can't do that right now, you appear to be offline"}
				action={mockAction}
				topOffset={"10%"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		const buttons = getAllByRole("button");
		expect(buttons.length).toEqual(1);
		fireEvent.press(getByText("Sorry, you can't do that right now, you appear to be offline"));
		expect(mockAction).toHaveBeenCalledTimes(1);
	});

	test("renders without an action button", () => {
		const { toJSON, queryByRole } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Sorry, you can't do that right now, you appear to be offline"}
				topOffset={"10%"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		const buttons = queryByRole("button");
		expect(buttons).toBeNull();
	});

	test("renders with diagnostics when diagnostics is a string", () => {
		const { toJSON, getByText } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Network error occurred"}
				topOffset={"10%"}
				diagnostics={"Connection timeout"}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		expect(getByText("Network error occurred")).toBeTruthy();
		expect(getByText('"Connection timeout"')).toBeTruthy(); // JSON.stringify adds quotes
	});

	test("renders with diagnostics when diagnostics is an object", () => {
		const diagnosticsError = new Error("Network connection failed");
		const { toJSON, getByText } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Network error occurred"}
				topOffset={"10%"}
				diagnostics={diagnosticsError}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		expect(getByText("Network error occurred")).toBeTruthy();
		expect(getByText(JSON.stringify(diagnosticsError))).toBeTruthy();
	});

	test("does not render diagnostics when diagnostics is not string or object", () => {
		const { toJSON, queryByText } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Network error occurred"}
				topOffset={"10%"}
				diagnostics={123 as unknown as string} // number type should not display
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		expect(queryByText("123")).toBeNull();
	});

	test("does not render diagnostics when diagnostics is null", () => {
		const { toJSON, getByText } = render(
			<OfflineMessage
				clearOfflineMessage={mockClearOfflineMessage}
				message={"Network error occurred"}
				topOffset={"10%"}
				diagnostics={null}
			/>
		);
		expect(toJSON()).toMatchSnapshot();
		expect(getByText("Network error occurred")).toBeTruthy();
		// Should not render any diagnostics
	});

	test("has correct testID for accessibility", () => {
		const { getByTestId } = render(
			<OfflineMessage clearOfflineMessage={mockClearOfflineMessage} message={"Test message"} topOffset={"10%"} />
		);
		expect(getByTestId("offlineMessage")).toBeTruthy();
	});

	test("handles empty message gracefully", () => {
		const { toJSON } = render(
			<OfflineMessage clearOfflineMessage={mockClearOfflineMessage} message={""} topOffset={"10%"} />
		);
		expect(toJSON()).toMatchSnapshot();
	});

	test("handles different topOffset values", () => {
		const { toJSON } = render(
			<OfflineMessage clearOfflineMessage={mockClearOfflineMessage} message={"Test message"} topOffset={"50%"} />
		);
		expect(toJSON()).toMatchSnapshot();
	});
});
