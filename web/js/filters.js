"use strict";

/* Filters */

angular.module("medialibraryFilters", [])

.filter("lastModifiedFilter", function() {
  return function(timestamp) {
		if (!timestamp) {
			return "";
		}

		var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

		var oldDate = new Date();
                    oldDate.setTime(timestamp.value);
		var difference = "";
		var newDate = new Date();
		
		if (newDate.getYear() > oldDate.getYear() || newDate.getMonth() > oldDate.getMonth()) {
			return oldDate.toLocaleDateString();
		}
		else if (newDate.getDate() > oldDate.getDate()) {
			return monthNames[oldDate.getMonth()] + " " + oldDate.getDate();
		}
		else {
			var hours = oldDate.getHours();
			hours = !hours ? 12 : hours > 12 ? hours - 12 : hours;
			var ampm = "AM";
			if (oldDate.getHours() > 11) {
				ampm = "PM";
			}
		
			var minutes = oldDate.getMinutes();
//			if ( hours < 10 ) { hours   = "0" + hours; }
			if ( minutes < 10 ) { minutes = "0" + minutes; }

			return hours + ":" + minutes + " " + ampm;

			//return oldDate.toLocaleTimeString();
		}
		
		return difference;
	};
})

.filter("fileTypeFilter", function() {
	return function(filename) {
		var re = /(?:\.([^.]+))?$/
                   ,ext;

                if (filename.substr(-1) === "/") {return "Folder";}

		ext = re.exec(filename)[1];

		if (ext && ext.length <= 4) {
			ext = ext.toUpperCase();
			return ext;
		}

		return "";
	};
})

.filter("fileNameFilter", ["$routeParams", function($routeParams) {
	return function(filename) {
		if ($routeParams.folder) {
                  if (filename === $routeParams.folder ||
                      filename === $routeParams.folder + "/") {
                    return "/Previous Folder";
                  } else {
                    return filename.substr($routeParams.folder.length + 1);
                  }
		}

		return filename;
	};
}])

.filter("fileSizeFilter", function() {
	return function(size) {
		var sizeString = "";
                if (size === 0) {return "0 bytes";}

                if (!size) { return "";}
		
		if (size < 1000) {
			sizeString = size + " bytes";
		}
		else if (size > 1024 && size < Math.pow(1024, 2)) {
			sizeString = Math.floor(size / (1024 / 10)) / 10.0 + " KB";
		}
		else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
			sizeString = Math.floor(size / (Math.pow(1024, 2) / 10)) / 10.0 + " MB";
		}
		else if (size >= Math.pow(1024, 3)) {
			sizeString = Math.floor(size / (Math.pow(1024, 3) / 10)) / 10.0 + " GB";
		}
		
		return sizeString;
	};
})

.filter("groupBy", function() {
    return function(items, groupedBy) {
        if (items) {
            var finalItems = [],
                thisGroup;
            for (var i = 0; i < items.length; i++) {
                if (!thisGroup) {
                    thisGroup = [];
                }
                thisGroup.push(items[i]);
                if (((i+1) % groupedBy) === 0) {
                    finalItems.push(thisGroup);
                    thisGroup = null;
                }
            }
            if (thisGroup) {
                finalItems.push(thisGroup);
            }
            return finalItems;
        }
    };
});
