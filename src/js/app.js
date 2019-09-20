import loadJson from '../components/load-json/'
import { Climitizer } from './modules/climitizer'


var app = {

	dataload: (key) => {

		loadJson(`${key}?t=${new Date().getTime()}`)
			.then((json) => {

				var citizen = new Climitizer(json.sheets.postcodes)

			})
	}

}

app.dataload("https://interactive.guim.co.uk/docsdata/1bClr8buuWUaKj01NolwaJy2JR_SR5hKEAjQoJPaGKcw.json");