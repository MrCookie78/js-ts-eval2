window.addEventListener("DOMContentLoaded"  , async () => {

	const reponse = await fetch("http://localhost:3000/depenses");
	const depenses = await reponse.json(); 

	document.querySelector(".liste").innerHTML = generListe(depenses);

	// gestion du nombre de dépenses
	let TotalDepenses = depenses.filter( depense => depense.montant < 0 )
	.reduce( function(accumulateur , item){ 
		return accumulateur + parseFloat(item.montant);
	} , 0 ); 
	document.querySelector("#depenses").innerHTML = TotalDepenses;

	// gestion du total de recettes
	let TotalRecettes = depenses.filter( depense => depense.montant >= 0 )
	.reduce( function(accumulateur , item){ 
		return accumulateur + parseFloat(item.montant);
	} , 0 ); 
	document.querySelector("#recettes").innerHTML = TotalRecettes;

	// gestion du total
	document.querySelector("#total").innerHTML = TotalDepenses + TotalRecettes;

	// écouter quand on clique dans la zone js-list-tache
	document.querySelector(".liste").addEventListener("click" , async e => {
	e.preventDefault();
	
	if(e.target.className.includes("btn")){
		const form = e.target.parentNode.parentNode;
		const action = e.target.value ;
		const id = form.id.value
		if(action == "modifier"){

			const schemaDepenseModif = joi.object({
				id : joi.number().required(),
				nom : joi.string().required(),
				montant : joi.number().required()
			})
		
			const data = {
				id : id,
				nom : form.nom.value,
				montant : form.montant.value
			}

			const{value , error} =  schemaDepenseModif.validate(data , {abortEarly : false})
			if(error){
				document.querySelector(".errorModif").innerHTML = error.details.map( d => {
					return `<p>${d.message}</p>`
				} ).join("")
				return
			}
			const options = { method : "PUT" , body : JSON.stringify(value) , headers : {'Content-Type': 'application/json'} }
			await fetch("http://localhost:3000/depenses/"+id , options)

		}
		else if(action == "supprimer"){
			const options = {method : "DELETE"}
			await fetch("http://localhost:3000/depenses/"+id , options);
		}
	}
})
});

function generListe(data){

	if(data.length === 0) return "<p>Veuillez ajouter des ...</p>";

	return data.map( d => {
			return `<form class="row">
				<div class="col-md-2">
					<input type="number" name="id" readonly class="form-control-plaintext" value="${d.id}">
				</div>
				<div class="col-md-3">
					<input type="text" name="nom" class="form-control-plaintext" value="${d.nom}">
				</div>
				<div class="col-md-3">
					<input type="number" name="montant" class="form-control-plaintext" value="${d.montant}">
				</div>
				<div class="col-md-4">
					<input type="submit" class="btn btn-warning" value="modifier">
					<input type="submit" class="btn btn-danger" value="supprimer">
				</div>
			</form>`;
	} ).join("")
}