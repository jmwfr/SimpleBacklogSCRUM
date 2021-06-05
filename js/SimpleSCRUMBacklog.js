const TASK_TEMPLATE = '<div class="task justify-content-between"><div class="taskPriority">1</div><div id="taskContent" class="w-75"></div></div>';
const TASK_PRIORITY = "<input id='taskPriority' type='number'/>";
const TASK_TEXTAREA = '<textarea></textarea>';
const TASK_SAVE_BUTTON = '<button class="taskSave btn btn-secondary justify-content-center p-0 pt-1"><i class="far fa-check-circle"></i></button>';
const TASK_CLOSE_BUTTON = '<button class="taskClose btn btn-secondary justify-content-center p-0 pt-1"><i class="far fa-times-circle"></i></button>';
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
                value: backlogFileName + ".json",
                text: backlogFileName
            });

            let optionExists = false;
            $('#backlogSelector option').each(function() {
                if($(this).val() === newOption.val()) {
                    optionExists = true;
                    return;
                }
            })
            
            if(!optionExists)
            {
                $('#backlogSelector').append($(newOption));
            }

            $('#backlogSelector').val(newOption.val());
            $('body').jmwfrPopup("show", {
                text: "Backlog '" + backlogFileName + "' saved successfully!",
                buttonsType: popupButtonsTypes.OKONLY,
                title: "Backlog saved!"
            });
            //alert("Backlog '" + backlogFileName + "' saved successfully!");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('body').jmwfrPopup("show", {
                text: "Status: " + textStatus + "<br/>Error: " + errorThrown,
                buttonsType: popupButtonsTypes.OKONLY,
                title: "Backlog save error!"
            });
            //alert("Status: " + textStatus + "\nError: " + errorThrown);
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
            alert(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });
}

function renameBacklog(backlogFileName, newBacklogName) {
    $.ajax(MANAGER_PATH, {
        method: 'POST',
        data: {action: "rename", fileName: backlogFileName, newFileName: newBacklogName},
        success: function (data, textStatus, jqXHR) {
            let valueSelector = 'option[value="' + backlogFileName + '"]';
            $('#backlogSelector').find(valueSelector).val(newBacklogName + ".json").text(newBacklogName);
            alert(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Status: " + textStatus + "\nError: " + errorThrown);
        }
    });
}

/**
 * Fills a backlog column when loading or sorting
 * @param wrapper
 * @param tasksList
 */
function fillTaskColumn(wrapper, tasksList) {
    wrapper.html("");
    for (let task of tasksList) {
        let tasksCount = $('#contentWrapper').find('.task').length;
        let newTask = $(TASK_TEMPLATE)
            .clone()
            .attr("id", ('task' + tasksCount))
            .draggable({connectToSortable: '.taskWrapper'})
            .append(TASK_CLOSE_BUTTON);

        newTask.find('.taskPriority').html(task.priority);
        newTask.find('#taskContent')
            .html(task.text.replace(new RegExp("\n", 'g'), "<br>"));
        wrapper.append(newTask);
    }
}

function orderTaskColum(wrapper, taskList, direction) {
    
    if(direction === "desc")
        taskList.sort((t1, t2) => t1.priority - t2.priority);
    else
        taskList.sort((t1, t2) => t2.priority - t1.priority);
    
    fillTaskColumn(wrapper, taskList);
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
    let actualPriority = task.find('.taskPriority').html();
    try {
        let actualText = task.find('#taskContent').html().replace(new RegExp("<br>", 'g'), "\n");
    
        task.html("");
        let $taskPriority = $(TASK_PRIORITY).val(actualPriority);
        let $taskTextarea = $(TASK_TEXTAREA).val(actualText);
        task.append($taskPriority);
        task.append($taskTextarea);
        task.append(TASK_SAVE_BUTTON);
        $taskTextarea.focus();
    }
    catch(e) {
        //Try...Catch just to avoid error when already in edit mode an user double click (i.e: changing priority with arrows too quickly)
    }
}

/**
 * Switches back a task to view mode when validating edition
 * @param task
 */
function switchTaskToViewMode(task) {
    let newText = task.find("textarea").val().replace(new RegExp("\n", 'g'), "<br>");
    newText = '<div id="taskContent" class="w-75">' + newText + '</div>';
    let newPriority = task.find("#taskPriority").val();
    newPriority = '<div class="taskPriority">' + newPriority + '</div>';

    task.find('#taskPriority').remove();
    task.find('textarea').remove();
    task.find('.taskSave').remove();

    task.append(newPriority)
        .append(newText)
        .append($(TASK_CLOSE_BUTTON));
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
            tasks: []
        },
        inProgress: {
            tasks: []
        },
        done: {
            tasks: []
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

        $(this).find('.task').each(function () {
            let taskText = $(this)
                .find('#taskContent')
                .html()
                .replace(new RegExp("<br>", 'g'), "\n");
            let taskPriority = $(this).find('.taskPriority').text();

            task = {
                'priority': parseInt(taskPriority),
                'text': taskText
            };

            tasksArray.push(task);
        });

        colCount++;
    });

    return backlog;
}

/**
 * document ready
 */
$(function () {

    $(window).on('beforeunload', function(){
        $('#backlogSelector').val("");
        $('#backlogName').val("");
    });

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
            switchTaskToViewMode($(this).parent());
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
        let jsonFile = backlog.name;
        let jsonBacklog = JSON.stringify(backlog, null, "\t");

        saveBacklog(jsonFile, jsonBacklog);
    });

    $('#backlogSelector').change(function () {
        let selectedFile = $(this).val();
        if (selectedFile === "") {
            resetAll();
            return;
        }
        loadBackLog(selectedFile);
    });

    $('#resetBacklog').click(function () {
        resetAll();
    });

    $('#backlogDelete').click(function() {
        let selector = $('#backlogSelector');
        if(selector.val() === "") return;
        if(confirm("Are you sure you want to delete backlog '" + selector.val().replace(".json", "") + "'")) {
            deleteBacklog(selector.val());
        }
    });

    $('#renameBacklog').click(function () {
        let selector = $('#backlogName');
        if(selector.val() === "") return;
        renameBacklog($('#backlogSelector').val(), selector.val());
    });

    $('.sortAsc, .sortDesc').click(function() {
        let backlogFileName = $('#backlogSelector').val();
        let backLogName = $('#backlogName').val();

        if(backlogFileName === "")
            return;

        let direction = $(this).attr("data-sort");
        let colId = $(this).closest(".content-column").attr("id");
        colId = colId.replace("Col", "");
        
        let backlogJSON = generateBacklog(backLogName); //Generates a temp backlog

        console.log(backlogJSON);

        if(colId == "todo") {
            let todoTasks = backlogJSON.todo.tasks;
            let todoWrapper = $('#todoWrapper');
            orderTaskColum(todoWrapper, todoTasks, direction);
        }
        
        if(colId == "inProgress") {
            let inProgressTasks = backlogJSON.inProgress.tasks;
            let InProgessWrapper = $('#inProgressWrapper');
            orderTaskColum(InProgessWrapper, inProgressTasks, direction);
        }

        if(colId == "done") {
            let doneTasks = backlogJSON.done.tasks;
            let doneWrapper = $('#doneWrapper');
            orderTaskColum(doneWrapper, doneTasks, direction);
        }
    });
});