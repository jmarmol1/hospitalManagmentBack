require('dotenv').config();
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInputObjectType, GraphQLID } = require('graphql');
const { PatientModel } = require('./models');
const { GraphQLBoolean } = require('graphql');

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

const schema = new GraphQLSchema({
  mutation: MutationType
});

const schema2 = new GraphQLSchema({
    mutation: MutationType2
  });
