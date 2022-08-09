import React from 'react';
import { extendTheme } from 'native-base';

export default extendTheme({
  components: {
    Heading: {
      variants: {
        main: {
           _light: {
            color: "white",
          },
          _dark: {
            color: "black",
          },
        },
        list: {
           _light: {
            color: "black",
          },
          _dark: {
            color: "white",
          },
          fontWeight: "normal",
        },
      },
    },
    Button: {
      variants: {
        solid: {
          backgroundColor: "#0078d4",
          color: "white",
        },
        subtle: {
          backgroundColor: "#0078d4",
          color: "white",
          borderRadius: "20px"
        },
        ghost: {
          backgroundColor: "transparent",
          color: "#0078d4",
        },
      },
    },
    IconButton: {
      variants: {
        solid: {
          backgroundColor: "#0078d4",
          color: "white",
        },
        subtle: {
          backgroundColor: "white",
          color: "#0078d4",
          borderRadius: "20px"
        },
        ghost: {
          color: "white",
        },
      },
    },
    Checkbox: {
      defaultProps: {
        _checked: {
          borderColor: `#0078d4`,
          bg: `#0078d4`,
        }
      },
    },
    FormControl: {
      defaultProps: {
        marginBottom: '15px',
      },
    },
    Select: {
      defaultProps: {
        backgroundColor: "white",
      },
    },
    Input: {
      defaultProps: {
        backgroundColor: "white",
      },
    },
    Badge: {
      variants: {
        outline: {
          borderWidth: "5px",
          _light: {
             borderColor: "#0078d4",
          },
          _dark: {
            borderColor: "white",
          },
        },
      },
    },
  }
});
