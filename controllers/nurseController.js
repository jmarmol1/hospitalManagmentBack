require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLID } = require('graphql');
const { PatientModel } = require('./models');

// GraphQL schema
const VitalSignInputType = new GraphQLInputObjectType({
  name: 'VitalSignInput',
  fields: {
    bodyTemperature: { type: GraphQLNonNull(GraphQLString) },
    heartRate: { type: GraphQLNonNull(GraphQLString) },
    bloodPressure: { type: GraphQLNonNull(GraphQLString) },
    respiratoryRate: { type: GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLNonNull(GraphQLString) }
  }
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addVitalSignsToPatient: {
      type: GraphQLString, 
      description: 'Add vital signs to a patient',
      args: {
        patientId: { type: GraphQLNonNull(GraphQLID) },
        vitalSigns: { type: GraphQLNonNull(VitalSignInputType) }
      },
      resolve: async (_, { patientId, vitalSigns }) => {
        try {
          await PatientModel.findByIdAndUpdate(patientId, {
            $push: { vitalSigns }
          });
          return 'Vital signs added successfully';
        } catch (error) {
          console.error(error);
          throw new Error('Error adding vital signs');
        }
      }
    }
  }
});

const schema = new GraphQLSchema({
  mutation: MutationType
});
