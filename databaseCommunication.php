<?php
class DatabaseConnection
{
	private $dbConnection;
	
	function Connect($fileName)
	{
		// Create a DSN for the database using its filename
		$dsn = "sqlite:$fileName";
			
		// Open the database file and catch the exception if it fails.
		try 
		{
			$this->dbConnection = new PDO($dsn);
			$this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			$stmt = $this->dbConnection->prepare( "PRAGMA foreign_keys = ON;" );
			$stmt->execute();
		} 
		catch (PDOException $e) 
		{
			echo "Failed to connect to the database using DSN:<br>$dsn<br>";
			throw $e;
		}
	}
	function GetValuesByKey($key)
	{
		$stmt = $this->dbConnection->prepare( "SELECT
		id,
		createdAt,
		value
		FROM logAnything
		WHERE key = ?;");
		
		$params = [$key];
		$stmt->execute($params);

		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $res;
	}

	function GetValuesByKeyAndRange($key, $minRange, $maxRange)
	{
		$stmt = $this->dbConnection->prepare( "SELECT
		id,
		createdAt,
		value
		FROM logAnything
		WHERE key = ?
		AND substr(createdAt, 1, ?) >= ?
		AND substr(createdAt, 1, ?) <= ?;");
		
		$minRangeLength = strlen($minRange);
		$maxRangeLength = strlen($maxRange);

		$params = [$key, $minRangeLength, $minRange, $maxRangeLength, $maxRange];
		$stmt->execute($params);

		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $res;
	}


	function GetAllKeys()
	{
		$stmt = $this->dbConnection->prepare( "SELECT DISTINCT key FROM logAnything");
		$stmt->execute();

		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return array_map(function ($obj) { return $obj["key"]; }, $res);
	}
	function InsertLogPost($key, $value)
	{
		$timestamp = date("Y-m-d H:i:s");

		$stmt = $this->dbConnection->prepare( "INSERT INTO logAnything
		('id', 'createdAt', 'key', 'value')
		VALUES (NULL, ?, ?, ?);");

		$params = [$timestamp, $key, $value];
		try {
			$stmt->execute($params);
		} catch (PDOException $e) {
			echo "<p>Failed to insert/update a new row, dumping details for debug.</p>";
			echo "<p>Incoming \$_POST:<pre>" . print_r($_POST, true) . "</pre>";
			echo "<p>The error code: " . $stmt->errorCode();
			echo "<p>The error message:<pre>" . print_r($stmt->errorInfo(), true) . "</pre>";
			throw $e;
		}

		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $res;
	}	

	function Delete($id)
	{
		$stmt = $this->dbConnection->prepare( "DELETE FROM logAnything
		WHERE id = ?");

		$params = [$id];

		try {
			$stmt->execute($params);
		} catch (PDOException $e) {
			echo "<p>Failed to insert/update a new row, dumping details for debug.</p>";
			echo "<p>Incoming \$_POST:<pre>" . print_r($_POST, true) . "</pre>";
			echo "<p>The error code: " . $stmt->errorCode();
			echo "<p>The error message:<pre>" . print_r($stmt->errorInfo(), true) . "</pre>";
			throw $e;
		}

		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $res;
	}
}
?>
