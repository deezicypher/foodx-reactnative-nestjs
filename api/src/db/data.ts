import { CustomizationType } from '../customizations/entities/customization.entity';

const dummyData = {
  categories: [
    {
      name: 'Flatbreads',
      description: 'Oven-fired flatbreads with fresh toppings',
    },
    {
      name: 'Noodle Bowls',
      description: 'Wok-tossed noodles and flavorful broths',
    },
    {
      name: 'Salad Bowls',
      description: 'Fresh greens, grains, and hearty proteins',
    },
    {
      name: 'Street Tacos',
      description: 'Soft corn tortillas with bright fillings',
    },
    {
      name: 'Comfort Plates',
      description: 'Filling classics made for a relaxed meal',
    },
    {
      name: 'Sweet Treats',
      description: 'Small-batch desserts and baked favorites',
    },
  ],

  customizations: [
    { name: 'Smoked Gouda', price: 1.5, type: CustomizationType.topping },
    { name: 'Pickled Red Onion', price: 0.75, type: CustomizationType.topping },
    { name: 'Roasted Chili Oil', price: 0.85, type: CustomizationType.sauce },
    { name: 'Lemon Herb Dressing', price: 0.65, type: CustomizationType.sauce },
    { name: 'Crispy Chickpeas', price: 1.25, type: CustomizationType.topping },
    { name: 'Grilled Halloumi', price: 2.5, type: CustomizationType.topping },
    { name: 'Steamed Jasmine Rice', price: 2, type: CustomizationType.side },
    {
      name: 'Sesame Cucumber Salad',
      price: 2.75,
      type: CustomizationType.side,
    },
    { name: 'Charred Corn Salsa', price: 1.1, type: CustomizationType.topping },
    { name: 'Soft-Boiled Egg', price: 1.4, type: CustomizationType.topping },
    { name: 'Vanilla Bean Scoop', price: 1.75, type: CustomizationType.side },
    { name: 'Gluten-Free Crust', price: 2.25, type: CustomizationType.base },
  ],

  menu: [
    {
      name: 'Fig & Fennel Flatbread',
      description:
        'Roasted figs, shaved fennel, whipped ricotta, and thyme honey.',
      image_url: 'https://images.unsplash.com/photo-1579751626657-72bc17010498',
      price: 13.5,
      rating: 4.6,
      calories: 510,
      protein: 18,
      category_name: 'Flatbreads',
      customizations: [
        'Smoked Gouda',
        'Pickled Red Onion',
        'Gluten-Free Crust',
      ],
    },
    {
      name: 'Miso Mushroom Flatbread',
      description:
        'King oyster mushrooms, white miso cream, scallions, and sesame.',
      image_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47',
      price: 14.25,
      rating: 4.8,
      calories: 560,
      protein: 21,
      category_name: 'Flatbreads',
      customizations: [
        'Smoked Gouda',
        'Roasted Chili Oil',
        'Gluten-Free Crust',
      ],
    },
    {
      name: 'Ginger Sesame Soba',
      description:
        'Buckwheat noodles, snap peas, carrots, and ginger-sesame glaze.',
      image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
      price: 12.75,
      rating: 4.5,
      calories: 490,
      protein: 19,
      category_name: 'Noodle Bowls',
      customizations: [
        'Soft-Boiled Egg',
        'Roasted Chili Oil',
        'Sesame Cucumber Salad',
      ],
    },
    {
      name: 'Coconut Curry Udon',
      description:
        'Thick udon noodles in coconut curry broth with baby spinach.',
      image_url: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb',
      price: 14,
      rating: 4.7,
      calories: 640,
      protein: 22,
      category_name: 'Noodle Bowls',
      customizations: [
        'Soft-Boiled Egg',
        'Steamed Jasmine Rice',
        'Roasted Chili Oil',
      ],
    },
    {
      name: 'Citrus Farro Garden Bowl',
      description:
        'Pearled farro, orange segments, arugula, fennel, and pistachio.',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      price: 11.95,
      rating: 4.4,
      calories: 430,
      protein: 16,
      category_name: 'Salad Bowls',
      customizations: [
        'Crispy Chickpeas',
        'Grilled Halloumi',
        'Lemon Herb Dressing',
      ],
    },
    {
      name: 'Roasted Sweet Potato Bowl',
      description: 'Warm sweet potato, quinoa, kale, pepitas, and lime tahini.',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
      price: 12.5,
      rating: 4.6,
      calories: 520,
      protein: 17,
      category_name: 'Salad Bowls',
      customizations: [
        'Crispy Chickpeas',
        'Grilled Halloumi',
        'Lemon Herb Dressing',
      ],
    },
    {
      name: 'Cedar-Roasted Cauliflower Tacos',
      description:
        'Three corn tortillas, roasted cauliflower, salsa verde, and cilantro.',
      image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
      price: 10.75,
      rating: 4.5,
      calories: 390,
      protein: 13,
      category_name: 'Street Tacos',
      customizations: [
        'Charred Corn Salsa',
        'Pickled Red Onion',
        'Smoked Gouda',
      ],
    },
    {
      name: 'Ancho Lime Chicken Tacos',
      description: 'Grilled chicken, avocado crema, cabbage, and fresh lime.',
      image_url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
      price: 12.25,
      rating: 4.7,
      calories: 470,
      protein: 31,
      category_name: 'Street Tacos',
      customizations: [
        'Charred Corn Salsa',
        'Pickled Red Onion',
        'Roasted Chili Oil',
      ],
    },
    {
      name: 'Maple-Mustard Salmon Plate',
      description: 'Glazed salmon with smashed potatoes and seasonal greens.',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
      price: 18.5,
      rating: 4.8,
      calories: 610,
      protein: 39,
      category_name: 'Comfort Plates',
      customizations: ['Steamed Jasmine Rice', 'Lemon Herb Dressing'],
    },
    {
      name: 'Herby Lentil Shepherd’s Pie',
      description:
        'Slow-cooked lentils under golden mashed potato with garden herbs.',
      image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554',
      price: 15.75,
      rating: 4.6,
      calories: 570,
      protein: 24,
      category_name: 'Comfort Plates',
      customizations: ['Smoked Gouda', 'Sesame Cucumber Salad'],
    },
    {
      name: 'Brown Butter Pear Tart',
      description:
        'Flaky pastry with roasted pear, brown butter, and a pinch of cardamom.',
      image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13',
      price: 7.25,
      rating: 4.9,
      calories: 360,
      protein: 5,
      category_name: 'Sweet Treats',
      customizations: ['Vanilla Bean Scoop'],
    },
    {
      name: 'Dark Chocolate Tahini Cookie',
      description: 'Chewy cocoa cookie with toasted sesame and flaky sea salt.',
      image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
      price: 4.5,
      rating: 4.7,
      calories: 280,
      protein: 6,
      category_name: 'Sweet Treats',
      customizations: ['Vanilla Bean Scoop'],
    },
  ],
};

export default dummyData;
