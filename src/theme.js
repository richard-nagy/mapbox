import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    // marginLeft: "5px",
                },
            },
        },
    },
});

export default theme;
