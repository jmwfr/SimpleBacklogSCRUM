<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Simple Backlog SCRUM</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Kalam|Lexend+Zetta|Raleway|Teko&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/SimpleBacklogSCRUM.css">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
            integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
            crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/6e948aba88.js"></script>
    <script src="js/SimpleBacklogSCRUM.js"></script>
</head>
<body>
<div id="contentWrapper" class="container-fluid">
    <div class="row">
        <div id="functionsCol" class="col-3 content-column">
            <div class="colTitle"><h2>Actions</h2></div>
            <div>
                <?php
                $backlogsDir = 'backlogs/';
                if (!file_exists($backlogsDir))
                    mkdir($backlogsDir, 0777, true);
                $backlogsFiles = array_diff(scandir($backlogsDir), array('..', '.'));
                ?>
                <div id="backlogSelectorWrapper">
                    <label for="backlogSelector" class="w-100 text-center">Select a Backlog</label>
                    <select id="backlogSelector" class="form-control">
                        <option value="">Select a backlog to load</option>
                        <?php
                        foreach ($backlogsFiles as $backlogFile) {
                            ?>
                            <option value="<?php echo $backlogFile; ?>"><?php echo implode(".", explode(".", str_replace("___", " ", $backlogFile), -1)); ?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
                <div id="backlogsActionsWrapper" class="d-flex justify-content-center mb-2">
                    <button id="backlogDelete" class="btn btn-danger w-100">Delete Selected</button>
                </div>
            </div>
            <div id="backlogNameWrapper" class="mb-2">
                <label for="backlogName" class="w-100 text-center">Backlog Name</label>
                <input id="backlogName" class="form-control" name="backlogName" type="text">
                <button id="renameBacklog" class="btn btn-primary w-100 mt-2">Rename Backlog</button>
                <button id="saveBacklog" class="btn btn-primary w-100 mt-2">Save Backlog</button>
            </div>
            <div class="restWrapper">
                <label class="w-100 text-center">Backlog Edition</label>
                <button id="btnAddTask" class="btn btn-primary w-100">Add Task</button>
                <button id="resetBacklog" class="btn btn-primary w-100 my-2">Reset</button>
            </div>
        </div>
        <div id="todoCol" class="col-3 content-column">
            <div class="colTitle"><h2>Todo</h2></div>
            <div id="todoWrapper" class="text-center taskWrapper">

            </div>
        </div>
        <div id="inProgressCol" class="col-3 content-column">
            <div class="colTitle"><h2>In Progress</h2></div>
            <div id="inProgressWrapper" class="text-center taskWrapper">

            </div>
        </div>
        <div id="doneCol" class="col-3 content-column">
            <div class="colTitle"><h2>Done</h2></div>
            <div id="doneWrapper" class="text-center taskWrapper">

            </div>
        </div>
    </div>
</div>
</body>
</html>