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
			return `<div class="alert alert-danger col-md-4 offset-4" role="alert">${d.message}</div>`
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