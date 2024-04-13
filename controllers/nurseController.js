const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLList, 
  GraphQLNonNull, 
  GraphQLInputObjectType, 
  GraphQLID,
  GraphQLBoolean,
  GraphQLSchema
} = require('graphql');
const PatientModel = require('../models/Patient');


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

const CommonSignsInputType = new GraphQLInputObjectType({
  name: 'CommonSignsInput',
  fields: {
    fever: { type: GraphQLNonNull(GraphQLBoolean) },
    cough: { type: GraphQLNonNull(GraphQLBoolean) },
    fatigue: { type: GraphQLNonNull(GraphQLBoolean) },
    headache: { type: GraphQLNonNull(GraphQLBoolean) },
    bodyAche: { type: GraphQLNonNull(GraphQLBoolean) }
  }
});

// Define GraphQL object types
const VitalSignType = new GraphQLObjectType({
  name: 'VitalSign',
  fields: {
    bodyTemperature: { type: GraphQLString },
    heartRate: { type: GraphQLString },
    bloodPressure: { type: GraphQLString },
    respiratoryRate: { type: GraphQLString },
    date: { type: GraphQLString }
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

const MutationType2 = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
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
    },
    updateCommonSigns: {
      type: GraphQLString,
      description: 'Update common signs for a patient',
      args: {
        patientId: { type: GraphQLNonNull(GraphQLID) },
        commonSigns: { type: GraphQLNonNull(CommonSignsInputType) }
      },
      resolve: async (_, { patientId, commonSigns }) => {
        try {
          await PatientModel.findByIdAndUpdate(patientId, {
            $set: { commonSigns }
          });
          return 'Common signs updated successfully';
        } catch (error) {
          console.error(error);
          throw new Error('Error updating common signs');
        }
      }
    }
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getVitalSigns: {
      type: new GraphQLList(VitalSignType),
      description: 'Get vital signs of a patient by patient ID',
      args: {
        patientId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: async (_, { patientId }) => {
        try {
          const patient = await PatientModel.findById(patientId);
          if (!patient) {
            throw new Error('Patient not found');
          }
          return patient.vitalSigns;
        } catch (error) {
          console.error(error);
          throw new Error('Error retrieving vital signs');
        }
      }
    }
  }
});


const schema = new GraphQLSchema({
  mutation: MutationType,
  query: QueryType 
});

const schema2 = new GraphQLSchema({
  mutation: MutationType2,
  query: QueryType 
});

const schema3 = new GraphQLSchema({
  query: QueryType 
});

module.exports = {
  schema,
  schema2,
  schema3
};
