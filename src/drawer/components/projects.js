import React from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Box, Flex, Heading, Select } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

import { dashboard } from '../../configs/constants';

import {
    GET_MY_PROJECTS,
    PROJECTS_SUBSCRIPTION,
} from '../../queries/projects';

import { setProject } from '../../apollo/localSchema/actions';

import { GET_PROJECT } from '../../apollo/localSchema/queries';
import { useTranslation } from 'react-i18next';

export default function DrawerContentProjects(props) {
    const { navigation } = props;

    const { t } = useTranslation();

    //network
    const {
        data: myProjectsData,
        loading: myProjectsLoading,
        refetch: myProjectsRefetch,
    } = useQuery(GET_MY_PROJECTS, {
        fetchPolicy: 'network-only',
    });

    //local
    const { data: projectData, loading: projectLoading } =
        useQuery(GET_PROJECT);

    useSubscription(PROJECTS_SUBSCRIPTION, {
        onSubscriptionData: () => {
            myProjectsRefetch();
        },
    });

    React.useEffect(() => {
        if (!myProjectsLoading) {
            if (
                myProjectsData &&
                myProjectsData.myProjects
            ) {
                const currentProject =
                    myProjectsData.myProjects.find(
                        (project) =>
                            project.project.id ===
                            projectData.localProject.id
                    );
                if (currentProject) {
                    setProject({
                        ...currentProject,
                        id: currentProject.project.id,
                        value: currentProject.project.id,
                        title: currentProject.project.title,
                        label: currentProject.project.title,
                    });
                }
            }
        }
    }, [myProjectsData, myProjectsLoading]);

    const localProject = projectData.localProject;
    const myProjects = (
        myProjectsData && myProjectsData.myProjects
            ? [...myProjectsData.myProjects]
            : []
    ).sort((project1, project2) =>
        project1.project.title > project2.project.title
            ? 1
            : -1
    );
    const projects = [dashboard, ...myProjects];

    return (
        <Box>
            <Flex
                direction="row"
                alignItems="center"
                mt="5"
                mx="5"
            >
                <AntDesign
                    name="folder1"
                    size={16}
                    color="black"
                />
                <Heading variant="list" size="md" ml="2">
                    {t('project')}
                </Heading>
            </Flex>

            <Select
                mx="2"
                mt="2"
                fontSize="md"
                color="red"
                defaultValue={-1}
                onValueChange={(itemValue) => {
                    const newLocalProject = projects.find(
                        (project) =>
                            project.project.id === itemValue
                    );
                    setProject(newLocalProject);
                }}
            >
                {projects.map((project) => (
                    <Select.Item
                        key={project.project.id}
                        label={project.project.title}
                        value={project.project.id}
                    />
                ))}
            </Select>
        </Box>
    );
}
