function loadDonations() {
	var apps = localStorage.getItem("applications");
	console.log("Applications Json = " + apps);
	
	console.log ('UserName | Project | Cost');
	var appsArr = JSON.parse(apps);
	if (appsArr != null) {
		for (line of appsArr) {
			var newRow = formApplicationTableRow(line.projectName, line.cost, line.userName);
			$('#projectTable > tbody:last').append(newRow);
		}
	}

	var donationsString = localStorage.getItem("donations");
	console.log("Donations Json = " + donationsString);
}

function whoDonatedToProject(projectName)
{
	var donationsForProject = getDonationsForProject(projectName);
	if (donationsForProject === null)
	{
		alert ("The donations database is empty");
	}
	else if (donationsForProject == undefined) {
		alert("There are no donations for project '"+projectName+"'");
	}
	else {
		var donationsForProject = donations[projectName];
		var result = "Donations for project " + projectName + ":\n";
		for (dons of donationsForProject) {
			result += dons.userName + ': $' + dons.amount + '\n';
		}
		alert(result);
	}
}

function formApplicationString(projectName, grantAmount, applicant) {
	return '{"projectName":"'+projectName+'", "cost":'+grantAmount+', "userName": "'+applicant+ '"}';
}

function tableCell(content)
{
	return '<td>'+content+'</td>';
}

function donateToProject(projectName, donatePopup) {
	$(donatePopup).show();
	var userNameField = $(donatePopup).find('#userName');
	var amountField = $(donatePopup).find('#amount');
	function clearAndHide() {
		userNameField.val("");
		amountField.val(0);
		donatePopup.hide();
	}
	$(donatePopup).find('#SubmitButton').on('click', function() {
		var userName = userNameField.val();
		var amount = amountField.val();
		if (userName === "") {
			alert("I'm sorry, we do not take anonymous donations");
		}
		else if (amount < 5) {
			alert("We are insulted by your small contribution! Try again...");
		}
		else {
			donateToProject(projectName, userName, amount);
			var totalDonated = totalDonationsForProject(projectName);
			$(this).closest('tr').find('#totalDonated').val(totalDonated);
			alert("Dear "+userName+", your donation of $"+amount +" towards "+projectName+" has been registered\n And remember, no good deed goes unpunished!");
			var donationsAfter = localStorage.getItem("donations");
			console.log("donationsAfter =  "+donationsAfter);
		}
		clearAndHide();
	});
	$(donatePopup).find('#CancelButton').on('click', function() {
		clearAndHide();
	});
}

function createDonatePopup() {
	return $('<div id="popupContact"> \
		<form action="#" id="form" method="post" name="form"> \
		<br>\
		<div align="left"> \
        	<label for="userName">User Name</label> \
        	<input id="userName" type="text" value="" name="name"> \
   		</div> \
   		<br>\
   		<div align="left"> \
   			<label for="amount">Donation Amount</label> \
			<input id="amount" name="amount" size="4" type="text"> \
		</div> \
		<br>\
		<button type="button" id="SubmitButton" name="OK">Submit</button> \
		<button type="button" id="CancelButton" name="OK">Cancel</button> \
		</form> \
	</div>');
}

function formApplicationTableRow(projectName, grantAmount, applicant, totalDonated) {
	var newRow = $('<tr align="center">'
		+tableCell(applicant)
		+tableCell(projectName)
		+tableCell(grantAmount)
		+tableCell('<input type="text" id="totalDonated" value="0" align="right" readonly>')
		+tableCell('<button id="donateButton" type="button">Donate to Project</button>')
		+tableCell('<button id="whoDonatedButton" type="button">Who Donated</button>')
		+'</tr>');
	var donateButton = $(newRow).find('#donateButton');
	var totalDonated = totalDonationsForProject(projectName);
	$(newRow).find('#totalDonated').val(totalDonated);		

	var donatePopup = createDonatePopup();
	donatePopup.hide();
	donateButton.after(donatePopup);
	donateButton.on('click', function () {
		$('#popupContact').hide(); //hide all the other open dialogs
		donateToProject(projectName, donatePopup);
	});
	$(newRow).find('#whoDonatedButton').on('click', function () {
		whoDonatedToProject(projectName);
	});
	
	return newRow;
}

function applyForGrant() {
	var grantAmount = $('#GrantAmount').val();
	var grantProjectName = $('#GrantProjectName').val();
	var grantApplicant = $('#GrantApplicant').val();
	var projectJson = formApplicationString(grantProjectName, grantAmount, grantApplicant);

	var newTableRow = formApplicationTableRow(grantProjectName, grantAmount, grantApplicant, 0);
	$('#projectTable > tbody:last').append(newTableRow);
	
	var apps = JSON.parse(localStorage.getItem("applications"));
	if (apps === null || apps === "null") {
		apps = [];
	}
	
	apps.push(JSON.parse(projectJson));
	var appsString = JSON.stringify(apps);
	localStorage.setItem('applications', appsString);
	console.log("applying for grant of $"	+ grantAmount
		+ " for project '" + grantProjectName + "'\n"
		+ projectJson);
	$('#GrantAmount').val(0);
	$('#GrantProjectName').val("");
	$('#GrantApplicant').val("");
}

function deleteProjects() {
	alert ('deleting all donations and applications');
	localStorage.setItem('donations', null);
	localStorage.setItem('applications', null);
	$("#projectTable").find("tr:gt(0)").remove();
}

function deleteDonations() {
	alert ('deleting only donations');
	localStorage.setItem('donations', null);
}

$(document).ready(
	function() { 
		loadDonations();
	}
);