import loadJson from '../components/load-json/'
import { Climitizer } from './modules/climitizer'


var app = {

	dataload: (key) => {

		//Promise.all([loadJson(`${key[0]}?t=${new Date().getTime()}`),loadJson(`${key[1]}?t=${new Date().getTime()}`)])

		loadJson(`${key}`)
			.then((results) =>  {

				var postcodes = results.sheets.postcodes

				var citizen = new Climitizer(postcodes)
				
			});

	}

}

app.dataload("https://interactive.guim.co.uk/docsdata/1bClr8buuWUaKj01NolwaJy2JR_SR5hKEAjQoJPaGKcw.json");



//"https://interactive.guim.co.uk/docsdata/1_oXrBEXimXW6pe5Z9mbCE7SOKH6iBCwvhWTAsjjW0x0.json"]