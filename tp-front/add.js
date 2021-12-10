document.querySelector("#add").addEventListener("submit" , async function(e) {
	e.preventDefault();
	
	const schemaDepense = joi.object({
		nom : joi.string().required(),
		montant : joi.number().required()
	})

	const depense = {
		nom : e.target.nom.value,
	  montant : e.target.montant.value
	}

	const{value , error} =  schemaDepense.validate(depense , {abortEarly : false})
	if(error){
		document.querySelector(".error").innerHTML = error.details.map( d => {
			return `<p>${d.message}</p>`
		} ).join("")
		return
	}
	const reponse = await fetch("http://localhost:3000/depenses" , { 
		method : "POST", 
		body : JSON.stringify(value),
		headers : {
				'Content-Type': 'application/json'
		}
	})
})