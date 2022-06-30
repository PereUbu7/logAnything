<?php

?>

<!DOCTYPE HTML>
<html>

<head>
	<title> Logga bränsle </title>
	<link rel="stylesheet" type="text/css" href="../styles/styles.css" />
	
	<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-min.js'></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	
	<script src="../scripts.js" type="text/javascript"></script>
	<script src="new.js" defer type="text/javascript"></script>

	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1">

</head>

<body>
    <main class="container-fluid pt-3">
		<div class="container">
  			<div class="row">
    			<h4 class="col-sm-6">Tanka</h4>
    			<h4 class="col-sm-6"><a href="../View/"><span class="pull-right">Titta</span></a></h4>
  			</div>
		</div>
        <section>
            <form class="form-group mt-5">
                <input class="form-control form-control-sm mb-3" type="date"
                    placeholder="Datum" data-bind="value: chosenDate"/>
				<select class="form-control form-control-sm" required 
					data-bind="options: bilar, value: valdBil, optionsCaption: 'Välj bil'"></select>
				<input class="form-control form-control-sm" required type="number"
					placeholder="Km" data-bind="value: km"/>
				<input class="form-control form-control-sm" required type="number"
					placeholder="Liter" data-bind="value: liter"/>
				<input class="form-control form-control-sm" required type="number"
					placeholder="Kronor" data-bind="value: kronor"/>
    
				<button type="button mt3" class="btn btn-dark my-3"
					data-bind="click: save">Spara</button>
                </div>
            </form>
        </section>
    </main>

</body>

</html>