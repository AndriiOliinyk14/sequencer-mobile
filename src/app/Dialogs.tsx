import React from 'react';
import {
  AddRecordSampleDialog,
  IconsLibrary,
  NewProjectDialog,
} from '../components';
import {ProjectSettings} from '../components/Dialog';

const Dialogs = () => {
  return (
    <>
      <NewProjectDialog />
      <AddRecordSampleDialog />
      <IconsLibrary />
      <ProjectSettings />
    </>
  );
};

export default Dialogs;
