// All of the updates and their corresponding dates that will be dynamically added in the updates section on about page
// Josh - please keep them specific to page system/ui updates and not added games, thanks
export const updates = [
	{ date: "4/19/25", content: "Added waffle menu on the homepage navigation bar" },
	{ date: "4/6/25", content: 'Added "Declined Games" menu in about section' },
	{ date: "4/1/25", content: "Added April Fool's update, removed the next day" },
	{ date: "2/24/25", content: "Added a card size slider to the main menu" },
	{ date: "10/21/24", content: "Updated login page UI" },
			{ date: "5/14/24", content: "Removed tabs/pagination on page 1" },
	{ date: "5/13/24", content: "Optimized top 10 load speed; added loading icons" },
	{ date: "5/12/24", content: "Added About section" },
];

// **This will be exported down below alphabetically sorted** //
const rawRefusedGamesData = [
	{ name: "Movies", reason: "Does not align with school district policies and legal standards" },
	{ name: "Uptoplay Online", reason: "Provides access to explicit material" },
	{ name: "Donkey Kong", reason: "File size exceeds limit" },
	{ name: "Mario Kart", reason: "File size exceeds limit" },
	{ name: "Sword Masters", reason: "Incompatible backend architecture" },
	{ name: "Pung.io", reason: "Unspecified technical issue" },
	{ name: "Schedule 1", reason: "Lacks necessary web port, incurs costs, and is legally restricted" },
	{ name: "Red Dead Redemption 1", reason: "Legally restricted content" },
	{ name: "Fears to Fathom", reason: "Lacks necessary web port" },
	{ name: "AI Minecraft", reason: "Incompatible with proxy server" },
	{ name: "Super Smash Bros", reason: "Unspecified technical issue" },
	{ name: "Playstore App", reason: "Installation impossible with only frontend access" },
	{ name: "What Beats Rock", reason: "Application malfunction" },
	{ name: "Web Searcher Proxy", reason: "Could bring up ethical/safety issues similar to the YouTube incident" },
	{ name: "Battle Cats", reason: "Lacks necessary web port" },
	{ name: "Roblox", reason: "Previously attempted without success" },
	{ name: "Moomoo.io", reason: "Functionality is not working" },
	{ name: "Hello Neighbor", reason: "No functional web port available" },
	{ name: "Xbox App", reason: "Currently will not work" },
	{ name: "Xbox Cloud Gaming", reason: "Currently will not work" },
	{ name: "Tetr.io", reason: "Game flags connection as potentially fraudulent" },
	{ name: "Spotify", reason: "Incompatible with proxy server, YouTube incident" },
	{ name: "Streaming Services", reason: "Unspecified technical issue" },
	{ name: "Bean Royal", reason: "Requires payment for access" },
	{ name: "OvO", reason: "Sitelock cannot be bypassed" },
	{ name: "Escape Road", reason: "Unable to download" },
	{ name: "Slope 3", reason: "Functionality is not working" },
	{ name: "Pokemon Showdown", reason: "Unspecified technical issue" },
	{ name: "TikTok", reason: "Blocked due to a past safety/ethical incident similar to YouTube's" },
	{ name: "Reddit", reason: "Blocked due to a past safety/ethical incident similar to YouTube's" },
	{ name: "Vencord", reason: "Unable to install extensions via the proxy" },
	{ name: "Unblocked Google", reason: "Blocked due to a past safety/ethical incident similar to YouTube's" },
	{ name: "Infinite Craft", reason: "Application malfunction" },
	{ name: "Soundboard", reason: "Unspecified technical issue" },
	{ name: "Space Flight Simulator", reason: "Only available on now.gg, which does not allow downloads" },
	{ name: "Balatro", reason: "Requires payment for access and is legally restricted" },
];
// Here is the actual export of the refused game data
export const refusedGamesData = rawRefusedGamesData.sort((a, b) => a.name.localeCompare(b.name));

// This holds all of the color themes for light/dark mode
export const modes = [
	{
		mode: "light",
		properties: {
			"--text-color": "rgba(0, 0, 0, 0.6)",
			"--body-background-gradient": "linear-gradient(30deg, #566d78, #ffcc80)",
			"--blob-1-gradient": "linear-gradient(0deg, #ffcc80, #ffab40)",
			"--blob-2-gradient": "linear-gradient(0deg, #b3e5fc, #4fc3f7)",
			"--blob-3-gradient": "linear-gradient(0deg, #c8e6c9, #81c784)",
			"--link-color": "#7152ff",
			"--input-bg": "rgba(0, 0, 0, 0.2)",
			"--input-bg-hover": "rgba(0, 0, 0, 0.3)",
		},
	},
	{
		mode: "dark",
		properties: {
			"--text-color": "rgba(255, 255, 255, 0.9)",
			"--body-background-gradient": "linear-gradient(30deg, #010101, #000000)",
			"--blob-1-gradient": "linear-gradient(72deg, #ff2079, #0400eb)",
			"--blob-2-gradient": "linear-gradient(0deg, #440bd4, #e92efb)",
			"--blob-3-gradient": "linear-gradient(220deg, #ff2079, #0400eb)",
			"--link-color": "#9178ff",
			"--input-bg": "rgba(0, 0, 0, 0.3)",
			"--input-bg-hover": "rgba(0, 0, 0, 0.4)",
		},
	},
];
