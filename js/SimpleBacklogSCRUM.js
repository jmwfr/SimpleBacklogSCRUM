const TASK_TEMPLATE = '<div class="task justify-content-between"><div id="taskContent" class="w-75"></div></div>';
const TASK_TEXTAREA = '<textarea></textarea>';
const TASK_SAVE_BUTTON = '<button class="taskSave btn btn-warning"><i class="far fa-check-circle"></i></button>';
const TASK_CLOSE_BUTTON = '<button class="taskClose btn btn-warning align-right"><i class="far fa-times-circle"></i></button>';
const ERROR_MSG = '<div class="bg-danger errorMessage"></div>';
const MANAGER_PATH = "/includes/backlogManager.php";
/**
 * Resets all the working area
 */
function resetAll() {
    $('#contentWrapper').find('.task').remove();
    $('#backlogName').val("");
    $('#backlogSelector').val("");
}

/**
 * Saves backlog to file via an ajax call
 * @param backlogFileName
 * @param backlogContent
 */
function saveBacklog(backlogFileName, backlogContent) {
    $.ajax(MANAGER_PATH, {
        method: 'POST',
        data: {action: "save", fileName: backlogFileName, fileContent: backlogContent},
        success: function (data, textStatus, jqXHR) {
            let newOption = $('<option>', {
                value: backlogFileName,
                text: $('#backlogName').val()
            });
            if(!$.contains('#backlogSelector', newOption))
            {
                $('#backlogSelector').append(newOption);
            }

            $('#backlogSelector').val(backlogFileName);
            alert(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });
}

function deleteBacklog(backlogFileName) {
    $.ajax(MANAGER_PATH, {
        method: 'POST',
        data: {action: "delete", fileName: backlogFileName},
        success: function (data, textStatus, jqXHR) {
            resetAll();
            let valueSelector = 'option[value="' + backlogFileName + '"]';
            $('#backlogSelector').find(valueSelector).remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });
}

/**
 * Fills a backlog column when loading
 * @param wrapper
 * @param tasksList
 */
function fillTaskColumn(wrapper, tasksList) {
    for (let taskKey in tasksList) {
        let tasksCount = $('#contentWrapper').find('.task').length;
        let newTask = $(TASK_TEMPLATE)
            .clone()
            .attr("id", ('task' + tasksCount))
            .draggable({connectToSortable: '.taskWrapper'})
            .append(TASK_CLOSE_BUTTON);

        newTask.find('#taskContent')
            .html(tasksList[taskKey].replace(new RegExp("\n", 'g'), "<br>"));
        wrapper.append(newTask);
    }
}

/**
 * Loads a backlog from a json saved file via an ajax call
 * @param backlogFileName
 */
function loadBackLog(backlogFileName) {
    $.ajax(MANAGER_PATH, {
        method: 'POST',
        data: {action: "load", fileName: backlogFileName},
        success: function (data, textStatus, jqXHR) {
            resetAll();

            let backlogJSON = eval("(" + data + ")");
            $('#backlogSelector').val(backlogFileName);
            $('#backlogName').val(backlogJSON.name);
            let todoTasks = backlogJSON.todo.tasks;
            let todoWrapper = $('#todoWrapper');
            fillTaskColumn(todoWrapper, todoTasks);

            let inProgressTasks = backlogJSON.inProgress.tasks;
            let InProgessWrapper = $('#inProgressWrapper');
            fillTaskColumn(InProgessWrapper, inProgressTasks);

            let doneTasks = backlogJSON.done.tasks;
            let doneWrapper = $('#doneWrapper');

            fillTaskColumn(doneWrapper, doneTasks);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });
}

/**
 * Adds a new task to todo column
 */
function addTask() {
    let tasksCount = $('#contentWrapper').find('.task').length;
    let newTask = $(TASK_TEMPLATE).clone()
        .attr("id", ('task' + tasksCount))
        .draggable({connectToSortable: '.taskWrapper'})
        .append(TASK_CLOSE_BUTTON);
    $('#todoWrapper').append(newTask);
}

/**
 * Switches a task to edit mode when double clicking on it
 * @param task
 */
function switchTaskToEditMode(task) {
    task.find('.taskClose').remove();
    let actualText = task.find('#taskContent').html().replace(new RegExp("<br>", 'g'), "\n");
    task.find('#taskContent').remove();
    task.html("");
    let $taskTextarea = $(TASK_TEXTAREA).val(actualText);
    task.append($taskTextarea);
    task.append(TASK_SAVE_BUTTON);
    $taskTextarea.focus();
}

/**
 * Switches back a task to view mode when validating edition
 * @param task
 */
function switchTaskToViewMode(task) {
    let newText = task.prev("textarea").val().replace(new RegExp("\n", 'g'), "<br>");
    newText = '<div id="taskContent" class="w-75">' + newText + '</div>';
    task.parent()
        .html(newText)
        .append($(TASK_CLOSE_BUTTON))
        .find('textarea')
        .remove()
        .find('.taskSave').remove();
}

/**
 * Generates a js array backlog
 * @param backlogName
 * @returns a js array containing a backlog
 */
function generateBacklog(backlogName) {
    let backlog = {
        name: backlogName,
        todo: {
            tasks: {}
        },
        inProgress: {
            tasks: {}
        },
        done: {
            tasks: {}
        }
    };

    let tasksArray = null;
    let colCount = 0;

    $('.taskWrapper').each(function (wrapper) {
        switch (colCount) {
            case 0:
                tasksArray = backlog.todo.tasks;
                break;
            case 1:
                tasksArray = backlog.inProgress.tasks;
                break;
            case 2:
                tasksArray = backlog.done.tasks;
                break;
        }

        let taskCount = 0;
        $(this).find('.task').each(function () {
            let taskText = $(this)
                .find('#taskContent')
                .html()
                .replace(new RegExp("<br>", 'g'), "\n");
            tasksArray['task' + taskCount] = taskText;
            taskCount++;
        });

        colCount++;
    });

    return backlog;
}

/**
 * document ready
 */
$(function () {

    $('#btnAddTask').click(function () {
        addTask();
    });

    $('.taskWrapper')
        .sortable()
        .droppable()
        .delegate(".task", "dblclick", function () {
            switchTaskToEditMode($(this));
        })
        .delegate('.taskSave', "click", function () {
            switchTaskToViewMode($(this));
        })
        .delegate(".taskClose", "click", function () {
            $(this).parent().remove();
        });

    $('#saveBacklog').click(function () {
        let backlogName = $('#backlogName').val();
        if (backlogName === "") {
            let $error = $(ERROR_MSG).text("Please enter a backlog name");
            $error.insertBefore($('#backlogName'));
            return;
        } else {
            $('.errorMessage').remove();
        }

        let backlog = generateBacklog(backlogName);
        let jsonFile = backlog.name + ".json";
        let jsonBacklog = JSON.stringify(backlog, null, "\t");

        saveBacklog(jsonFile, jsonBacklog);
    });

    $('#backlogSelector').change(function () {
        let selectedFile = $(this).val();
        if (selectedFile === "") {
            return
        }
        loadBackLog(selectedFile);
    });

    $('#resetBacklog').click(function () {
        resetAll();
    });

    $('#backlogDelete').click(function() {
        let selector = $('#backlogSelector');
        if(selector.val() === "") return;
        if(confirm("Are you sure you want to delete backlog: " + selector.val())) {
            deleteBacklog(selector.val());
        }
    });
});