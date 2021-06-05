<?php
try
{
    $action = $_POST['action'];

    if($action == "save")
    {
        $fileName = str_replace(" ", "___", $_POST['fileName']).".json";
        $fileContent = $_POST['fileContent'];

        if(!file_exists("../backlogs/"))
            mkdir("../backlogs/", 0777, true);

        if(file_put_contents("../backlogs/".$fileName, $fileContent, LOCK_EX))
        {
            echo "Backlog '".$_POST['fileName']."' saved successfully !";
        }
        else
        {
            throw new Error("Error while saving backlog");
        }
    }
    if($action == "load")
    {
        $fileName = str_replace(" ", "_", $_POST['fileName']);
        if(file_exists("../backlogs/".$fileName))
        {
            echo file_get_contents("../backlogs/".$fileName);
        }
        else
        {
            throw new Error("Error while reading backlog ($fileName)");
        }
    }
    if($action == "delete")
    {
        $fileName = $_POST['fileName'];
        if(file_exists("../backlogs/".$fileName))
        {
            unlink("../backlogs/".$fileName);
            echo "Backlog '".str_replace(["___", ".json"], [" ", ""], $fileName)."' deleted successfully!";
        }
    }
    if($action == "rename")
    {
        $fileName = "../backlogs/".$_POST['fileName'];
        $fileName = str_replace(" ", "___", $fileName);
        $newFileName = "../backlogs/".str_replace(" ", "___", $_POST['newFileName']).".json";
        if(file_exists($fileName)) {
            rename($fileName, $newFileName);
            $fileContent = file_get_contents($newFileName);
            $arrayContent = json_decode($fileContent, true);
            $arrayContent['name'] = $_POST['newFileName'];
            $jsonContent = json_encode($arrayContent);
            file_put_contents($newFileName, $jsonContent);
            echo "Backlog '".str_replace(["___", ".json"], [" ", ""],  $_POST['fileName'])."' renamed successfully!";
        }
        else
        {
            throw new Error("Error while renaming backlog ".$fileName." to ".$newFileName);
        }
    }
}
catch(Error $err)
{
    echo"Error code: ".$err->getCode()."\nError message: ".$err->getMessage();
}
