import {Reducer} from "react";
import {Results, ResultsReducible} from "./data/ExplorationDataActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {PersonExplorationState} from "./PersonExploration";
import any = jasmine.any;

const explorationPersonReducer: <PersonExplorationState, PayloadAction<any>> = (prevState=initialState, action) => {
    switch (action.type) {