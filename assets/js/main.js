const THEME = "theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const DATA_THEME = "data-theme";

function handleTheme(){
	//Handle theme preferences
	let themePreference = Cookies.get(THEME);
	
	if(!themePreference) {
		themePreference = THEME_DARK; 	// Default is dark in body.
		Cookies.set(THEME, themePreference, {'expires': 365});
	}
	else {
		let switcher = document.querySelector("#theme-switch");
		if(themePreference === THEME_LIGHT){
			switcher.setAttribute("checked", "checked");
		}
		else{
			switcher.removeAttribute("checked");
		}
	}
	document.body.setAttribute(DATA_THEME, themePreference);
}
handleTheme();

$(function(){
	$("#theme-switch").on("click", function(){
		let chosenTheme;
		if (this.checked) { chosenTheme = THEME_LIGHT; }
		else{ chosenTheme = THEME_DARK; }
		
		Cookies.set(THEME, chosenTheme, {'expires': 365});
		handleTheme();
	});	
});