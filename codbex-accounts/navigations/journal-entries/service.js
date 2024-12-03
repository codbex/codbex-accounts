const navigationData = {
    id: 'journal-entry-navigation',
    label: "Journal Entry",
    group: "sales",
    order: 600,
    link: "/services/web/codbex-accounts/gen/ui/JournalEntry/index.html?embedded"
};
debugger;

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
