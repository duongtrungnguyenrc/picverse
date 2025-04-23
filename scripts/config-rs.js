const config = {
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-primary:27017", priority: 1 },
    { _id: 1, host: "mongo-secondary:27017", priority: 0 },
    { _id: 2, host: "mongo-arbiter:27017", arbiterOnly: true }
  ]
};

function initiateReplicaSet() {
  try {
    const status = rs.status();
    
    if (status.ok) {
      print("Replica set already initialized.");
      return;
    }
  } catch (statusError) {
    print("Replica set not yet initialized, proceeding with rs.initiate...");
  }

  try {
    rs.initiate(config);
    print("Replica set initiated successfully.");
  } catch (initError) {
    print("Error during rs.initiate: " + initError);

    try {
      rs.reconfig(config, { force: true });
      print("Replica set reconfigured successfully.");
    } catch (reconfigError) {
      print("Error during rs.reconfig: " + reconfigError);
    }
  }
}

initiateReplicaSet();
