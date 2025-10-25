import React, { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Drawer,
  TextField,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [schemaDropdowns, setSchemaDropdowns] = useState([]);

  const webhookURL = "https://webhook.site/49231acb-36d1-4d93-8678-38109caae1f1";

  const allSchemas = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "City", value: "city" },
  ];

  const handleAddDropdown = () => {
    if (!selectedSchema) return;
    setSchemaDropdowns((prev) => [...prev, selectedSchema]);
    setSelectedSchema("");
  };

  const handleDropdownChange = (index, value) => {
    setSchemaDropdowns((prev) => {
      const newDropdowns = [...prev];
      newDropdowns[index] = value;
      return newDropdowns;
    });
  };

  const handleRemoveDropdown = (index) => {
    setSchemaDropdowns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSegment = async () => {
    const payload = {
      segment_name: segmentName,
      schema: schemaDropdowns
        .map((value) => {
          const s = allSchemas.find((s) => s.value === value);
          return s ? { [s.value]: s.label } : null;
        })
        .filter(Boolean),
    };

    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Segment saved successfully!");
        setIsSidebarOpen(false);
        setSegmentName("");
        setSchemaDropdowns([]);
        setSelectedSchema("");
      } else {
        alert("Error sending data!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send data.");
    }
  };

  const availableSchemas = allSchemas.filter(
    (s) => !schemaDropdowns.includes(s.value)
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
    <Button
    variant="contained"
    size="large"
    sx={{ bgcolor: "#49b394", color: "#fff", "&:hover": { bgcolor: "#43a047" } }}
    onClick={() => setIsSidebarOpen(true)}
  >
    Save Segment
  </Button>

      {/* Right Side Drawer */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <Box
          sx={{
            width: 400,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: "#38afbb", p: 2 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Save Segment
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Enter the name of the segment:
            </Typography>
            <TextField
              fullWidth
              label="Segment Name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              margin="normal"
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              To save your segements ,Add schemas to build the query:
            </Typography>

            <Paper variant="outlined" sx={{ mt: 1, p: 2, bgcolor: "blue.50" }}>
              {schemaDropdowns.map((value, index) => {
                const options = allSchemas.filter(
                  (s) => !schemaDropdowns.includes(s.value) || s.value === value
                );
                return (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1, alignItems: "center" }}
                  >
                    <FormControl fullWidth size="small">
                      <Select
                        value={value}
                        onChange={(e) =>
                          handleDropdownChange(index, e.target.value)
                        }
                      >
                        {options.map((s) => (
                          <MenuItem key={s.value} value={s.value}>
                            {s.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveDropdown(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}

              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="schema-select-label">Select Schema</InputLabel>
                <Select
                  labelId="schema-select-label"
                  value={selectedSchema}
                  label="Select Schema"
                  onChange={(e) => setSelectedSchema(e.target.value)}
                >
                  <MenuItem value="">
                    <em>-- Select the schema --</em>
                  </MenuItem>
                  {availableSchemas.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="text"
                size="small"
                sx={{ mt: 1, color: "#49b394", textDecoration: "underline", "&:hover": { bgcolor: "transparent" } }}
                onClick={handleAddDropdown}
              >
                + Add new schema
              </Button>
            </Paper>
          </Box>

          {/* Footer Buttons */}
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#49b394", color: "#fff", flex: 1 }}
                onClick={handleSaveSegment}
              >
                Save Segment
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#f44336",
                  border: "1px solid #f44336",
                  flex: 1,
                }}
                onClick={() => setIsSidebarOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default App;
