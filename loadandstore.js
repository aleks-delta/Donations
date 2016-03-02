//this contains utility functions for dealing with localStorage / backend
//no alerts or console logs will be emitted from here, the caller should handle that

function getDonationsForProject(projectName)
{
	var donationsString = localStorage.getItem("donations");
	donations = JSON.parse(donationsString);
	if (donations != null) {
		var donationsForProject = donations[projectName];
		if (donationsForProject == undefined) {
			return undefined; //signifies missing entry for this project
		}
		else {
			return donationsForProject;
		}
	}
	return null; //signifies empty database
}

function totalDonationsForProject(projectName)
{
	var donationsForProject = getDonationsForProject(projectName);
	if (donationsForProject === null || donationsForProject === undefined) {
		return 0;
	}
	var total = 0;
	for (dons of donationsForProject) {
		total += parseInt(dons.amount);
	}
	return total;
}

function donateToProject(projectName, userName, amount) {
	var donations = JSON.parse(localStorage.getItem("donations"));
	if (donations === null) {
		donations = {};
	}
	if (donations[projectName]==undefined) {
		donations[projectName] = [];
	}
	var newDonation = {'userName': userName, 'amount': amount};
	donations[projectName].push(newDonation);
	localStorage.setItem("donations", JSON.stringify(donations));
}