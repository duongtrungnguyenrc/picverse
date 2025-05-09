const config = {
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017", priority: 1 },
    { _id: 1, host: "localhost:27018", priority: 0 },
    { _id: 2, host: "localhost:27019", arbiterOnly: true }
  ]
};

try {
  rs.initiate(config, { force: true });
} catch (error) {
  print("Error during rs.initiate: " + error);
  try {
    rs.reconfig(config, { force: true });
  } catch (error) {
    print("Error during rs.reconfig: " + error);
  }
}
