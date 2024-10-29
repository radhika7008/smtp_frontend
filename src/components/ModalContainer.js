import { Button, Modal, Typography, Box, Slider } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useEffect } from 'react';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    color: "white",
    bgcolor: '#3c3c3c',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalContainer = ({ open, setTageStatus, setOpen, handleAddTagData }) => {

    const handleClose = () => setOpen(false);
    // States for the checkboxes and length
    const [length, setLength] = useState(10);
    const [tagName, setTagName] = useState("");
    const [lettersUpper, setLettersUpper] = useState(true);
    const [lettersLower, setLettersLower] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [randomNumber, setRandomNumber] = useState("")

    // Character sets
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbersSet = "0123456789";

    // Handle length change from slider and input field
    const handleLengthChange = (event, newValue) => {
        setLength(newValue);
    };

    const handleInputChange = (event) => {
        setLength(event.target.value === '' ? '' : Number(event.target.value));
    };

    // Function to generate random tag
    const generateRandomTag = () => {
        let characterPool = "";

        if (lettersUpper) characterPool += upperCaseLetters;
        if (lettersLower) characterPool += lowerCaseLetters;
        if (numbers) characterPool += numbersSet;

        if (characterPool.length === 0) {
            alert("Please select at least one character set");
            return;
        }

        // Generate random string
        let randomTag = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            randomTag += characterPool[randomIndex];
        }

        // Set the generated tag as the tagName
        setRandomNumber(randomTag);
    };

    useEffect(() => {
        // generateRandomTag()
    }, [lettersUpper, lettersLower, numbers, length]);

    console.log("randomNumber", randomNumber)


    // Handle form submission
    const handleSubmit = () => {
        // generateRandomTag()
        const options = {
            tagName,
            length,
            lettersUpper,
            lettersLower,
            numbers,
            randomNumber
        };
        
        setTageStatus(true)
        console.log("Generated Tag Options:", options);
        // Add logic to handle the generated tag based on selected inputs.
        handleAddTagData(options)
    };
    return (
        <div >

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* Input for Tag Name */}
                    <button onClick={() => setOpen(false)}>close</button>
                    <TextField
                        fullWidth
                        label="Tag Name"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        color="white"
                        style={{
                            color: "white"
                        }}
                    />

                    {/* Checkboxes for character sets */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={lettersUpper}
                                onChange={(e) => setLettersUpper(e.target.checked)}
                            />
                        }
                        label="Letters (A-Z)"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={lettersLower}
                                onChange={(e) => setLettersLower(e.target.checked)}
                            />
                        }
                        label="Letters (a-z)"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={numbers}
                                onChange={(e) => setNumbers(e.target.checked)}
                            />
                        }
                        label="Numbers (0-9)"
                    />

                    {/* Slider for length */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Slider
                            value={typeof length === 'number' ? length : 0}
                            onChange={handleLengthChange}
                            aria-labelledby="length-slider"
                            step={1}
                            min={1}
                            max={20}
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label="Length"
                            value={length}
                            color='white'
                            onChange={handleInputChange}
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: 20,
                                type: 'number',
                            }}
                        />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!tagName}
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ ml: 2 }}
                            onClick={() => {
                                // Reset form
                                setTagName("");
                                setLength(10);
                                setLettersUpper(true);
                                setLettersLower(true);
                                setNumbers(true);
                                generateRandomTag(); // Regenerate random tag
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                    {/* </Box> */}

                </Box>
                {/*  */}
            </Modal>
        </div>
    );
}



export default ModalContainer;