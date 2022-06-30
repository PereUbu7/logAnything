<?php

?>

<!DOCTYPE HTML>
<html>

<head>
	<title> Summa bränsle </title>
	<link rel="stylesheet" type="text/css" href="../styles/styles.css" />
	<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-min.js'></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	
	<script src="../scripts.js" type="text/javascript"></script>
	<script src="view.js" defer type="text/javascript"></script>

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
    			<h4 class="col-sm-6">Titta</h4>
    			<h4 class="col-sm-6"><a href="../New/"><span class="pull-right">Tanka</span></a></h4>
  			</div>
		</div>
        <section>
            <form class="form-group mt-5">
                <input class="form-control form-control-sm mb-3" type="date"
                    placeholder="Startdatum" data-bind="date: chosenStartDate"/>
				<input class="form-control form-control-sm mb-3" type="date"
                    placeholder="Slutdatum" data-bind="date: chosenEndDate"/>
				<select class="form-control form-control-sm" required 
					data-bind="options: bilar, value: valdBil, optionsCaption: 'Välj bil', event:{ change: loadLogs }"></select>

				<p data-bind="text: totalKmText" class="mt-3"></p>
				<p data-bind="text: summaLiterText"></p>
				<p data-bind="text: summaKronorText"></p>
				<p data-bind="text: literPerKmText"></p>
				<p data-bind="text: kronorPerKmText"></p>
				
				<table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Tid</th>
                            <th>Km</th>
                            <th>Liter</th>
                            <th>Kronor</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: { data: filteredLogs, includeDestroyed: false } ">
						<tr>
							<td>
								<i class="fa fa-remove removeTableRowButton"
									data-bind="click: $root.removeLogPost"></i>
							</td>
							<td>
								<div>
									<p data-bind="text: tidsstämpel"></p>
								</div>
							</td>
							<td>
								<div>
									<p data-bind="text: km"></p>
								</div>
							</td>
							<td>
								<div>
									<p data-bind="text: liter"></p>
								</div>
							</td>
							<td>
								<div>
									<p data-bind="text: kronor"></p>
								</div>
							</td>
						</tr>
                    </tbody>
                </table>
            </form>
        </section>
    </main>

</body>

</html>