export const findByTestID = (component, type, testId) => {
	return component.find(type).filterWhere(c => c.props().testID === testId).first().props()
}