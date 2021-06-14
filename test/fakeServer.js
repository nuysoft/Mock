Mock.mock("fake/file", {
    "data|100": [
        {
            ID: "@increment()",
            name: "@cname()",
            description: "@csentence()",
            avatar: '@dataImage("64x64")',
            address: "@region()",
            province: "@province()",
        },
    ],
});

axios.get("fake/file").then((res) => console.log(res));
