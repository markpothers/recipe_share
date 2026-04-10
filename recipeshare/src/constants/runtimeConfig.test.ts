import {
	getEffectiveSeedMode,
	normalizeApiUrl,
	normalizeSeedMode,
	PRODUCTION_API_URL,
} from "./runtimeConfig";

describe("runtimeConfig", () => {
	describe("normalizeApiUrl", () => {
		test("falls back to production URL when missing", () => {
			expect(normalizeApiUrl("")).toBe(PRODUCTION_API_URL);
		});

		test("trims trailing slashes", () => {
			expect(normalizeApiUrl("http://10.0.0.1:3000/api///")).toBe("http://10.0.0.1:3000/api");
		});
	});

	describe("normalizeSeedMode", () => {
		test("accepts short", () => {
			expect(normalizeSeedMode("short")).toBe("short");
		});

		test("accepts long in mixed case", () => {
			expect(normalizeSeedMode("LONG")).toBe("long");
		});

		test("falls back to empty for invalid values", () => {
			expect(normalizeSeedMode("banana")).toBe("empty");
		});
	});

	describe("getEffectiveSeedMode", () => {
		test("forces empty in production runtime", () => {
			expect(getEffectiveSeedMode("short", true)).toBe("empty");
			expect(getEffectiveSeedMode("long", true)).toBe("empty");
		});

		test("uses configured mode when not production runtime", () => {
			expect(getEffectiveSeedMode("short", false)).toBe("short");
			expect(getEffectiveSeedMode("long", false)).toBe("long");
			expect(getEffectiveSeedMode("empty", false)).toBe("empty");
		});
	});
});
