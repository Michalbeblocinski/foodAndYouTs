import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Logo from "../../utils/logo.svg";
import Chef from "../../utils/chef.svg";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setLogout } from "../../store/authSlice";

const pages = ["Search"];
const pagesMobile = [
  "Search",
  "Recipes of the day",
  "Following users recipes",
  "Recipes with your ingredients",
  "Recipes with wanted ingredients",
  "Breakfast",
  "Lunch",
  "Supper",
];
const Recipes = [
  "Recipes of the day",
  "Following users recipes",
  "Recipes with your ingredients",
  "Recipes with wanted ingredients",
];
const Categories = ["Breakfast", "Lunch", "Supper"];
const settings = ["My Profile"];

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElCategories, setAnchorElCategories] =
    React.useState<null | HTMLElement>(null);
  const handleOpenCategoriesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCategories(event.currentTarget);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const Logout = () => {
    setAnchorElUser(null);
    const auth = getAuth();
    dispatch(setLogout());
    signOut(auth);
  };
  const isAuth = useSelector(selectIsLoggedIn);

  return (
    <>
      <div className="w-full h-70px"></div>
      <AppBar position="fixed" sx={{ backgroundColor: "#1C1D21" }}>
        <Container maxWidth="xl" className="bg-primary">
          {isAuth ? (
            <Toolbar disableGutters className="mobile:justify-between">
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pagesMobile.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link to={`/${page.toLowerCase().replace(/\s+/g, "-")}`}>
                        <Typography textAlign="center">{page}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Link to={`/`}>
                <img
                  src={Logo}
                  className="max-w-70 h-auto desktop:mr-10px"
                  alt="Logo"
                />
              </Link>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    component={Link}
                    to={`/${page.toLowerCase()}`}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <Typography textAlign="center" sx={{ fontSize: "14px" }}>
                      RECIPES
                    </Typography>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    {Recipes.map((page) => (
                      <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Link
                          to={`/${page.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <Typography textAlign="center">{page}</Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-categories"
                    aria-haspopup="true"
                    onClick={handleOpenCategoriesMenu}
                    color="inherit"
                  >
                    <Typography textAlign="center" sx={{ fontSize: "14px" }}>
                      CATEGORIES
                    </Typography>
                  </IconButton>
                  <Menu
                    id="menu-categories"
                    anchorEl={anchorElCategories}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElCategories)}
                    onClose={() => setAnchorElCategories(null)}
                    sx={{
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    {Categories.map((page) => (
                      <MenuItem
                        key={page}
                        onClick={() => setAnchorElCategories(null)}
                      >
                        <Link
                          to={`/${page.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <Typography textAlign="center">{page}</Typography>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <img src={Chef} className="w-45px" alt="menuProfile" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Link
                        to={`/${setting.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </Link>
                    </MenuItem>
                  ))}

                  <MenuItem key={"Logout"} onClick={Logout}>
                    <Typography textAlign="center">{"Logout"}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          ) : (
            <>
              {" "}
              <Toolbar disableGutters className="mobile:justify-between">
                <img
                  src={Logo}
                  className="max-w-70 h-auto desktop:mr-10px"
                  alt="Logo"
                />
              </Toolbar>
            </>
          )}
        </Container>
      </AppBar>
    </>
  );
};
