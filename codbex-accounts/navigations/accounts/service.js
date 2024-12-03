const navigationData = {
    id: 'accounts-navigation',
    label: "Accounts",
    group: "configurations",
    order: 700,
    link: "/services/web/codbex-accounts/gen/ui/Accounts/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
