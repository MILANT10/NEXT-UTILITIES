# Create-component-fast

**Are you tired of creating your react component manually ? Me too ! Here is the simple way to create your components in few seconds**

This tool can create react component with your terminal in few seconds.

## Install

To install `create-component-fast` globbaly, run the following command in your terminal:

```sh
$ npm install -g create-component-fast

```

### How it's work ?

Just run the following command

```sh
$ CCF

```

Or

```sh
$ ccf

```

- That will ask you differents options

  - Name of the component
  - With a style associate or not
  - Extension of the style
  - Extension of the component

### Create your components with your choices

- You can create different type of components:

  - jsx component
  - tsx component

- You can chose a style file associate

  - css file
  - scss file

Currently supported options are:

| Option       | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `Name`       | Name of the component                                                      |
| `Style`      | Set a style associate with the component `y , n`                           |
| `Style type` | Set the extension fo the style associate with the component `"css","scss"` |
| `Type`       | Set the extension of the component `"jsx", "tsx"`                          |

#### Example

```sh
$ CCF MySuperComponent y css jsx
```
