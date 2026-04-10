const { withAndroidManifest } = require("expo/config-plugins");

const withCustomAndroidManifest = (config) => {
	return withAndroidManifest(config, async (config) => {
		const androidManifest = config.modResults;

		// Add appComponentFactory to application tag
		if (androidManifest.manifest?.application) {
			const application = androidManifest.manifest.application[0];
			if (application.$) {
				application.$["android:appComponentFactory"] = "androidx.core.app.CoreComponentFactory";

				// Add tools:replace attribute to handle conflicts
				if (!application.$["xmlns:tools"]) {
					androidManifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
				}
				application.$["tools:replace"] = "android:appComponentFactory";
			}
		}

		return config;
	});
};

module.exports = withCustomAndroidManifest;
