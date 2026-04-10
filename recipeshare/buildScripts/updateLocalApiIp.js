const fs = require("fs");
const os = require("os");
const path = require("path");

const envFileArg = process.argv[2] || ".env.dev";
const portArg = process.argv[3] || "3000";

const projectRoot = path.resolve(__dirname, "..");
const envPath = path.resolve(projectRoot, envFileArg);

const preferredInterfaces = ["en0", "en1", "eth0", "wlan0"];

function findLanIp() {
	const interfaces = os.networkInterfaces();

	for (const iface of preferredInterfaces) {
		const addresses = interfaces[iface] || [];
		const ipv4 = addresses.find((a) => a && a.family === "IPv4" && !a.internal);
		if (ipv4 && ipv4.address) {
			return ipv4.address;
		}
	}

	for (const addresses of Object.values(interfaces)) {
		for (const addr of addresses || []) {
			if (addr && addr.family === "IPv4" && !addr.internal) {
				return addr.address;
			}
		}
	}

	return null;
}

function upsertEnvKey(text, key, value) {
	const line = `${key}=${value}`;
	const regex = new RegExp(`^${key}=.*$`, "m");

	if (regex.test(text)) {
		return text.replace(regex, line);
	}

	const suffix = text.endsWith("\n") || text.length === 0 ? "" : "\n";
	return `${text}${suffix}${line}\n`;
}

const ip = findLanIp();
if (!ip) {
	console.error("Could not determine a LAN IPv4 address.");
	process.exit(1);
}

const apiUrl = `http://${ip}:${portArg}/api`;
const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const updated = upsertEnvKey(existing, "EXPO_PUBLIC_API_URL", apiUrl);
fs.writeFileSync(envPath, updated, "utf8");

console.log(`Updated ${envFileArg}: EXPO_PUBLIC_API_URL=${apiUrl}`);
