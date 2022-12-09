import React from 'react';
import {
    useQuery,
    useMutation,
    useApolloClient,
    useSubscription,
} from '@apollo/client';
import axios from 'react-native-axios';

import { DeviceEventEmitter } from 'react-native';

import { ScrollView, Spinner, Text } from 'native-base';

import localStorage from 'react-native-sync-localstorage';

import TaskEdit from './editContainer';

import { getMyData } from '../../../helperFunctions/userData';

import { toSelArr } from '../../../helperFunctions/select';

import { localFilterToValues } from '../../../helperFunctions/filter';

import {
    GET_BASIC_USERS,
    USERS_SUBSCRIPTION,
} from '../../../queries/users';

import {
    GET_BASIC_COMPANIES,
    COMPANIES_SUBSCRIPTION,
} from '../../../queries/companies';

import {
    GET_MY_PROJECTS,
    PROJECTS_SUBSCRIPTION,
} from '../../../queries/projects';

import {
    GET_COMMENTS,
    COMMENTS_SUBSCRIPTION,
} from '../../../queries/comments';

import {
    GET_TASK,
    DELETE_TASK,
    TASK_DELETE_SUBSCRIPTION,
    UPDATE_TASK,
    DELETE_TASK_ATTACHMENT,
} from '../../../queries/tasks';

import {
    GET_FILTER,
    GET_PROJECT,
} from '../../../apollo_copy/localSchema/queries';

import { REST_URL } from '../../../configs/restAPI';

let commentChecker = 0;

export default function TaskEditContainer(props) {
    //data & queries
    const { navigation, route } = props;

    const { taskId } = route.params;
    const fromInvoice = undefined;

    const client = useApolloClient();

    const {
        data: basicCompaniesData,
        loading: basicCompaniesLoading,
        refetch: basicCompaniesRefetch,
    } = useQuery(GET_BASIC_COMPANIES, {
        fetchPolicy: 'network-only',
    });
    const {
        data: basicUsersData,
        loading: basicUsersLoading,
        refetch: basicUsersRefetch,
    } = useQuery(GET_BASIC_USERS, {
        fetchPolicy: 'network-only',
    });
    const {
        data: myProjectsData,
        loading: myProjectsLoading,
        refetch: myProjectsRefetch,
        error: myProjectsError,
    } = useQuery(GET_MY_PROJECTS, {
        variables: {
            fromInvoice,
        },
        fetchPolicy: 'network-only',
    });

    //console.log('myProjectsError', myProjectsError);

    const {
        data: taskData,
        loading: taskLoading,
        refetch: taskRefetch,
        error: taskError,
    } = useQuery(GET_TASK, {
        variables: {
            id: taskId,
            fromInvoice,
        },
    });

    const {
        data: commentsData,
        loading: commentsLoading,
        refetch: commentsRefetch,
        error: commentsError,
    } = useQuery(GET_COMMENTS, {
        variables: {
            task: taskId,
            page: 1,
            limit: 50,
        },
        fetchPolicy: 'network-only',
    });

    //local
    const { data: filterData } = useQuery(GET_FILTER);

    const { data: projectData } = useQuery(GET_PROJECT);

    const [updateTask] = useMutation(UPDATE_TASK);

    const [deleteTask] = useMutation(DELETE_TASK);
    const [deleteTaskAttachment] = useMutation(
        DELETE_TASK_ATTACHMENT
    );

    useSubscription(TASK_DELETE_SUBSCRIPTION, {
        variables: {
            taskId,
        },
        onSubscriptionData: () => {
            navigation.goBack();
        },
    });

    useSubscription(PROJECTS_SUBSCRIPTION, {
        onSubscriptionData: () => {
            myProjectsRefetch();
        },
    });

    useSubscription(COMPANIES_SUBSCRIPTION, {
        onSubscriptionData: () => {
            basicCompaniesRefetch();
        },
    });

    useSubscription(USERS_SUBSCRIPTION, {
        onSubscriptionData: () => {
            basicUsersRefetch();
        },
    });

    useSubscription(COMMENTS_SUBSCRIPTION, {
        variables: {
            taskId,
        },
        onSubscriptionData: () => {
            commentsRefetch({
                task: taskId,
                page: 1,
                limit: 50,
            });
        },
    });

    DeviceEventEmitter.addListener(
        'event.submitComment',
        (eventData) => {
            if (commentChecker === 0) {
                commentChecker++;
                submitComment(
                    eventData.body,
                    eventData.attachments
                );
            }
        }
    );

    React.useEffect(() => {
        taskRefetch({
            id: taskId,
            fromInvoice,
        });
    }, [taskId]);

    React.useEffect(() => {
        commentsRefetch({
            task: taskId,
            page: 1,
            limit: 50,
        });
    }, [taskId]);

    const [saving, setSaving] = React.useState(false);

    //functions
    const updateCasheStorage = (response, key, type) => {
        const task = client.readQuery({
            query: GET_TASK,
            variables: {
                id: taskId,
                fromInvoice,
            },
        }).task;
        let newTask = {
            ...task,
        };
        newTask[key] = [...newTask[key]];
        switch (type) {
            case 'ADD': {
                newTask[key].push(response);
                break;
            }
            case 'UPDATE': {
                newTask[key][
                    newTask[key].findIndex(
                        (item) => item.id === response.id
                    )
                ] = response;
                break;
            }
            case 'DELETE': {
                newTask[key] = newTask[key].filter(
                    (item) => item.id !== response.id
                );
                break;
            }
            default: {
                return;
            }
        }
        client.writeQuery({
            query: GET_TASK,
            variables: {
                id: taskId,
                fromInvoice,
            },
            data: {
                task: newTask,
            },
        });
    };

    // TODO: proper delete
    const deleteTaskFunc = () => {
        /*
    if ( window.confirm( "Are you sure you want to delete this task?" ) ) {
      deleteTask( {
          variables: {
            id: taskId,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          try {
            let tasks = client.readQuery( {
                query: GET_TASKS,
                variables: {
                  filterId: filterData.localFilter.id,
                  filter: localFilterToValues( filterData.localFilter ),
                  projectId: projectData.localProject.id,
                  sort: null
                }
              } )
              .tasks;
            client.writeQuery( {
              query: GET_TASKS,
              variables: {
                filterId: filterData.localFilter.id,
                filter: localFilterToValues( filterData.localFilter ),
                projectId: projectData.localProject.id,
                sort: null
              },
              data: {
                ...tasks,
                tasks: tasks.tasks.filter( ( task ) => task.id !== id )
              }
            } );
          } catch ( err ) {}
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
    */
    };

    const addAttachment = async (file) => {
        if (file != null) {
            let fileToUpload = {
                type: file.mimeType,
                name: file.name,
                uri:
                    Platform.OS === 'android'
                        ? file.uri
                        : file.uri.replace('file://', ''),
            };

            const formData = new FormData();
            formData.append(`file`, fileToUpload);
            formData.append(
                'token',
                `Bearer ${localStorage.getItem('acctok')}`
            );
            formData.append('taskId', taskId);

            axios
                .post(
                    `${REST_URL}/upload-attachments`,
                    formData,
                    {
                        headers: {
                            'Content-Type':
                                'multipart/form-data',
                        },
                        transformRequest: () => {
                            return formData;
                        },
                    }
                )
                .then((response) => {
                    const newAttachments =
                        response.data.attachments.map(
                            (attachment) => ({
                                ...attachment,
                                __typename:
                                    'TaskAttachment',
                            })
                        );
                    const oldTask = client.readQuery({
                        query: GET_TASK,
                        variables: {
                            id: taskId,
                        },
                    }).task;
                    client.writeQuery({
                        query: GET_TASK,
                        variables: {
                            id: taskId,
                        },
                        data: {
                            task: {
                                ...oldTask,
                                taskAttachments: [
                                    ...oldTask.taskAttachments,
                                    ...newAttachments,
                                ],
                            },
                        },
                    });
                });
        }
    };

    const removeAttachment = (attachment) => {
        deleteTaskAttachment({
            variables: {
                id: attachment.id,
                fromInvoice,
            },
        }).then((response) => {
            const oldTask = client.readQuery({
                query: GET_TASK,
                variables: {
                    id: taskId,
                    fromInvoice,
                },
            }).task;
            client.writeQuery({
                query: GET_TASK,
                variables: {
                    id: taskId,
                    fromInvoice,
                },
                data: {
                    task: {
                        ...oldTask,
                        taskAttachments:
                            oldTask.taskAttachments.filter(
                                (taskAttachment) =>
                                    taskAttachment.id !==
                                    attachment.id
                            ),
                    },
                },
            });
        });
    };

    const submitComment = (message, attachments) => {
        const formData = new FormData();
        attachments.forEach((file) =>
            formData.append(`file`, file)
        );
        //FORM DATA
        formData.append(
            'token',
            `Bearer ${localStorage.getItem('acctok')}`
        );
        formData.append('taskId', taskId);
        formData.append('message', `<p>${message}</p>`);
        formData.append('parentCommentId', null);
        formData.append('internal', false);
        formData.append('fromInvoice', false);
        axios
            .post(`${REST_URL}/send-comment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.data.ok) {
                    //setBody(`<br>${currentUser.signature.replace(/(?:\r\n|\r|\n)/g, '<br>')}`);
                    //setShowError(false);

                    commentsRefetch({
                        task: taskId,
                        page: 1,
                        limit: 5,
                    });
                } else {
                }
            })
            .catch((err) => {});
    };

    const currentUser = getMyData();
    const dataLoading =
        !currentUser ||
        basicCompaniesLoading ||
        basicUsersLoading ||
        myProjectsLoading ||
        !myProjectsData ||
        !myProjectsData.myProjects ||
        commentsLoading ||
        commentsError ||
        taskLoading;

    if (taskError) {
        return (
            <ScrollView>
                <Text>{taskError.message}</Text>
            </ScrollView>
        );
    }

    if (dataLoading) {
        return (
            <ScrollView m="5">
                <Spinner size="lg" />
            </ScrollView>
        );
    }

    return (
        <TaskEdit
            {...props}
            taskId={taskId}
            fromInvoice={fromInvoice}
            task={taskData.task}
            currentUser={currentUser}
            accessRights={currentUser.role.accessRights}
            companies={toSelArr(
                basicCompaniesData.basicCompanies
            )}
            users={toSelArr(
                basicUsersData.basicUsers,
                'fullName'
            )}
            projects={toSelArr(
                myProjectsData.myProjects.map(
                    (project) => ({
                        ...project,
                        id: project.project.id,
                        title: project.project.title,
                    })
                )
            )}
            emails={[]}
            filterValues={localFilterToValues(
                filterData.localFilter
            )}
            originalProjectId={projectData.localProject.id}
            filterId={filterData.localFilter.id}
            addAttachment={addAttachment}
            removeAttachment={removeAttachment}
            deleteTaskFunc={deleteTaskFunc}
            updateCasheStorage={updateCasheStorage}
            updateTask={updateTask}
            client={client}
            saving={saving}
            setSaving={setSaving}
            comments={commentsData.comments}
            resetCommentChecker={() => {
                commentChecker = 0;
            }}
        />
    );
}
