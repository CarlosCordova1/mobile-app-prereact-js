<?php
header("Access-Control-Allow-Origin: *");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


class mysql_db
{
	private $conn;
	//Errores en la Base de datos
	public $e, $id;
	private $server = '209.59.139.38';
      private  $username ='';
      private  $password = '';
      private  $db ='';
	
	function __construct() {
		
        $this->connect();
	}
	
	private function connect()
	
    {   $conn = mysqli_connect($this->server, $this->username, $this->password ,$this->db);
    	 
    	//var_dump($conn);
     ;
		//mysql_select_db($this->db , $conn);
		if (mysqli_connect_errno()) {
			printf("Connect failed: %s\n", mysqli_connect_error());
			$this->conn = false;
		}
		else
		{
			mysqli_set_charset($conn, "utf8");
			$this->conn=$conn;
			//var_dump($conn);
		}		
		
    }
	public function ejecutar($sql)
	{	
		$stid = mysqli_query( $this->conn, $sql);	
		$this->id = mysqli_insert_id($this->conn);
		return($stid);
	}
	
	public function consulta_multiple($sql=false)
	{		

		if ($sql)
		{
			$stid = $this->ejecutar($sql);
	
			while ($row = mysqli_fetch_array($stid, MYSQLI_BOTH)) {		
				$array[] = $row;		
			}
			
			if(!empty($array))
			{
				return($array);
			}
			else
			{
				return (array(0=> false) );
			}
		}
		
	}
	public function consulta_unico($sql)
	{
		$dato=$this->ejecutar($sql);
		$array='';
		//valido si viene vacio el dato, de ser asi devuelvo un falso
		if($dato)
		{
			foreach ($dato as $row)
			{			
				$array = $row;
			}
		}
		return($array); 
		
	}
}

$consulta = new mysql_db();
//echo '<br>';
header('Content-Type: application/json');

if (isset($_GET["found"])) {
	echo json_encode(($consulta->consulta_multiple('SELECT * FROM test; ')));
}
else if (isset($_GET["insert"])) {
	$a=json_encode($_SERVER["REMOTE_ADDR"]);

	echo json_encode(($consulta->ejecutar('INSERT INTO `test` (`descripcion`, `datein`)  VALUES ('.$a.',NOW()); ')));
}
else
{
	echo '{"warning":"no found"}';
}


?>