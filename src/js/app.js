import loadJson from '../components/load-json/'
import { Climitizer } from './modules/climitizer'


var app = {

	dataload: (key) => {

		Promise.all([loadJson(`${key[0]}?t=${new Date().getTime()}`),loadJson(`${key[1]}?t=${new Date().getTime()}`)])
			.then((results) =>  {
				var citizen = new Climitizer(results[0].sheets.postcodes, results[1].sheets.Sheet1)
			});

	}

}

app.dataload(["https://interactive.guim.co.uk/docsdata/1bClr8buuWUaKj01NolwaJy2JR_SR5hKEAjQoJPaGKcw.json","https://interactive.guim.co.uk/docsdata/1_oXrBEXimXW6pe5Z9mbCE7SOKH6iBCwvhWTAsjjW0x0.json"]);



