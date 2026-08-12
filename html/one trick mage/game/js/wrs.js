_wrs = (function(){
	var wrs = [
		"5.11",		// 1
		"7.16",		// 2
		"7.95",		// 3
		"3.38",		// 4
		"2.47",		// 5
		"7.60",		// 6
		"4.07",		// 7
		"4.07",		// 8
		"12.54",	// 9
		"10.47",	// 10
		"5.72",		// 11
		"12.98",	// 12
		"7.13",		// 13
		"4.90",		// 14
		"4.67",		// 15
	];
	
	var decimal_places_display = 2;
	var customTimes = null;

    return {
		// Return the WR times, or return custom times if they were set by the user
        getTimes: function() {
			if (customTimes) {
				return {"title": "Pace", "wrs": customTimes};
			}

			// There are no custom times, so just return the WR times instead
            return {"title": "WR", "wrs": wrs};
		},
		// Set new custom level times 
		setCustomTimes: function(times) {
			// Check if the given object by the user is valid - must be array
			// Also disable custom level times in TAS mode
			if (TAS_MODE || !times || !Array.isArray(times)) {
				customTimes = null;
				return;
			}
			
			// Flag to check if at least one value in the custom times is valid
			var validFlag = false;

			// Copy only the first 15 elements, any more are irrelevant
			times = times.slice(0, 15);

			for (var i = 0; i < times.length; i++) {
				levelTime = times[i];
				
				// check if the current level time is a valid number
				if (typeof(levelTime) === "number" && levelTime >= 0 && levelTime < 100){
					times[i] = levelTime.toFixed(decimal_places_display);
					validFlag = true;
				}
				// In case of invalid number, take the WR time instead
				else {
					times[i] = wrs[i];
				}
			}

			// If the length of the custom times array is less than 15, copy the rest of the WR times into it
			times = times.concat(wrs.slice(times.length));

			if (validFlag)
				customTimes = times;
			else
				customTimes = null;
		}
	};
})();