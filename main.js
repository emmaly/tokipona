var wordBox;
var templateIjo;
var dictionary;

function selectedNimi(ijo) {
	var nimiSelect = ijo.querySelector(".nimi");
	var wordSelect = ijo.querySelector(".word");
	wordSelect.options.length = 0;
	var words = nimiSelect.options[nimiSelect.selectedIndex].dataset.words.split(";");
	for (var i in words) {
		var option = document.createElement("option");
		option.textContent = words[i];
		wordSelect.appendChild(option);
	}
}

function removeIjo(me) {
	console.log(me.parentNode.querySelectorAll(".ijo"));
	if (me.parentNode.querySelectorAll(".ijo").length < 2) {
		return false;
	}
	me.parentNode.removeChild(me);
}

function addIjo(rightOf) {
	var newIjo  = templateIjo.cloneNode(true);
	newIjo.classList.remove("template");
	newIjo.querySelector(".nena .add").addEventListener("click", function(){
		addIjo(newIjo.closest(".ijo"));
	});
	newIjo.querySelector(".nena .delete").addEventListener("click", function(){
		removeIjo(newIjo);
	});
	newIjo.querySelector(".nimi").addEventListener("change", function(e) {
		selectedNimi(e.target.closest(".ijo"));
	})
	wordBox.insertBefore(newIjo, rightOf.nextSibling);
	newIjo.querySelector("select").focus();
}

function onload() {
	wordBox = document.querySelector("#words");
	templateIjo = wordBox.querySelector(".ijo.template");

	fetch("dictionary.json").then(function(response){
		if (response.status !== 200) {
			console.error("ERROR FETCHING DICTIONARY");
			return;
		}
		response.json().then(function(data){
			dictionary = data;
			var nimiSelect = templateIjo.querySelector("select.nimi");
			nimiSelect.appendChild(document.createElement("option"));
			for (var nimi in dictionary.words) {
				var option = document.createElement("option");
				option.textContent = nimi;
				var words = [];
				if (!!dictionary.words[nimi].parts) {
					for (var part in dictionary.words[nimi].parts) {
						if (!!dictionary.words[nimi].parts[part].examples) {
							for (var i in dictionary.words[nimi].parts[part].examples) {
								var word = dictionary.words[nimi].parts[part].examples[i];
								words.push(word + " [" + part + ", example]");
							}
						}
						if (!!dictionary.words[nimi].parts[part].words) {
							for (var i in dictionary.words[nimi].parts[part].words) {
								var word = dictionary.words[nimi].parts[part].words[i];
								words.push(word + " [" + part + "]");
							}
						}
					}
				}
				option.dataset.words = words.join(";");
				nimiSelect.appendChild(option);
			}
			addIjo(templateIjo);
			removeIjo(templateIjo);
		});
	});
}

document.addEventListener("DOMContentLoaded", onload);