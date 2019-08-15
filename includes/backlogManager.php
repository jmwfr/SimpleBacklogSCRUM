<?php
try
{
    $action = $_POST['action'];

    if($action == "save")
    {
        $fileName = $_POST['fileName'];
        $fileContent = $_POST['fileContent'];

        if(!file_exists("../backlogs/"))
            mkdir("../backlogs/", 0777, true);

        if(file_put_contents("../backlogs/".$fileName, $fileContent))
        {
            echo "Backlog ".$fileName." saved successfully !";
        }
        else
        {
            throw new Error("Error while saving backlog");
        }
    }
    if($action == "load")
    {
        $fileName = $_POST['fileName'];
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
        }
    }

}
catch(Error $err)
{
    throw $err;
}
