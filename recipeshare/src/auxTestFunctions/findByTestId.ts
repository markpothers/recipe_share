import React from "react";

// Type definitions for Enzyme wrapper - adjust based on your actual Enzyme version
interface EnzymeWrapper {
	find: (selector: string | React.ComponentType | React.ComponentClass) => EnzymeWrapper;
	filterWhere: (predicate: (wrapper: EnzymeWrapper) => boolean) => EnzymeWrapper;
	first: () => EnzymeWrapper;
	props: () => Record<string, unknown>;
}

export const findByTestID = (
	component: EnzymeWrapper,
	type: string | React.ComponentType | React.ComponentClass,
	testId: string
): Record<string, unknown> => {
	return component
		.find(type)
		.filterWhere((c) => c.props().testID === testId)
		.first()
		.props();
};
