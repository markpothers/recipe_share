import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OfflineMessage from "./offlineMessage";

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
		jest.runAllTimers();
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
		jest.runAllTimers();
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
});
