/*
 * Licensed to Marvelution under one or more contributor license 
 * agreements.  See the NOTICE file distributed with this work 
 * for additional information regarding copyright ownership.
 * Marvelution licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

Date.SECOND_MILLIS = 1000;
Date.MINUTE_MILLIS = 60 * Date.SECOND_MILLIS;
Date.HOUR_MILLIS = 60 * Date.MINUTE_MILLIS;
Date.DAY_MILLIS = 24 * Date.HOUR_MILLIS;
Date.WEEK_MILLIS = 7 * Date.DAY_MILLIS;
Date.MONTH_MILLIS = 31 * Date.DAY_MILLIS;
Date.YEAR_MILLIS = 52 * Date.WEEK_MILLIS;

/**
 * Format the given duration
 * 
 * @param duration the duration in millis to format
 * @return the formatted duration
 */
Date.prototype.duration = function(duration) {
	return Date.duration(duration);
}

/**
 * Format the given duration
 * 
 * @param duration the duration in millis to format
 * @return the formatted duration
 */
Date.duration = function(duration) {
	var years = (duration / Date.YEAR_MILLIS).toFixed(0);
	var remDuration = duration % Date.YEAR_MILLIS;
	var months = (remDuration / Date.MONTH_MILLIS).toFixed(0);
	remDuration %= Date.MONTH_MILLIS;
	var days = (remDuration / Date.DAY_MILLIS).toFixed(0);
	remDuration %= Date.DAY_MILLIS;
	var hours = (remDuration / Date.HOUR_MILLIS).toFixed(0);
	remDuration %= Date.HOUR_MILLIS;
	var minutes = (remDuration / Date.MINUTE_MILLIS).toFixed(0);
	remDuration %= Date.MINUTE_MILLIS;
	var seconds = (remDuration / Date.SECOND_MILLIS).toFixed(0);
	remDuration %= Date.SECOND_MILLIS;
	var millisecs = (remDuration).toFixed(0);
	if (years > 0) {
		return years + " yr " + months + " mo"
	} else if (months > 0 && days == 1) {
		return months + " mo " + days + " day"
	} else if (months > 0) {
		return months + " mo " + days + " days"
	} else if (days == 1) {
		return days + " day " + hours + " hr"
	} else if (days > 0) {
		return days + " days " + hours + " hr"
	} else if (hours > 0) {
		return hours + " hr " + minutes + " min"
	} else if (minutes > 0) {
		return minutes + " min " + seconds + " sec"
	} else if (seconds > 0) {
		return seconds + " sec"
	} else {
		return millisecs + " ms";
	}
}

/**
 * Format the Date using the given date format
 * 
 * @param format the format to use
 * @return the formatted date
 */
Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") { 
			returnStr += curChar;
		} else if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else if (curChar != "\\"){
			returnStr += curChar;
		}
	}
	return returnStr;
};
 
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); },
	// Week
	W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() },
	// Year
	L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },
	o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear(); },
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
	// Timezone
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result; },
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d\\TH:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};
