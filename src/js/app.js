import loadJson from '../components/load-json/'
import { Climitizer } from './modules/climitizer'


var app = {

	dataload: (key) => {

		loadJson(`${key}`)
			.then((results) =>  {

				var postcodes = results.sheets.postcodes

				var citizen = new Climitizer(postcodes)

			});

	}

}

app.dataload("https://interactive.guim.co.uk/docsdata/1bClr8buuWUaKj01NolwaJy2JR_SR5hKEAjQoJPaGKcw.json");