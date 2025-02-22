import React from 'react';
import {
  NewProjectDialog,
  RecordDialog,
  AddEditSampleDialog,
  AddRecordSampleDialog,
} from '../components';

const Dialogs = () => {
  return (
    <>
      <RecordDialog />
      <NewProjectDialog />
      <AddEditSampleDialog />
      <AddRecordSampleDialog />
    </>
  );
};

export default Dialogs;
