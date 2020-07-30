import psycopg2
from psycopg2 import Error
from random import choice
from functools import reduce

####################### DATABASE #######################
DATABASE    = 'sampledatabase'
HOST        = 'localhost' 
PORT        = 5432
USER_NAME   = 'postgres'
PASSWORD    = '123456'
########################################################

######################## TABLES ########################
BOOK_TABLE              = 'thuvienbk_book'
BOOK_AUTHOR_TABLE       = 'thuvienbk_book_authors'
AUTHOR_TABLE            = 'thuvienbk_bookauthor'
BOOK_CATEGORY_TABLE     = 'thuvienbk_book_categories'
CATEGORY_TABLE          = 'thuvienbk_bookcategory'
IMAGE_TABLE             = 'thuvienbk_bookimage'
########################################################

class Book:
    #id
    #title
    #language:
    #publisher_name:
    #published_year:
    #ISBN:
    #price:
    #rating_point:
    #num_of_rates:
    #in_stocks:
    #author:list
    #category:list
    #image:list

    def __init__(self, id):
        self.id = id
        self.title = None
        self.language = None
        self.publisher_name = None
        self.published_year = None
        self.ISBN = None
        self.price = None
        self.rating_point = None
        self.num_of_rates = None
        self.in_stocks = None
        self.sales_volume = None
        self.author = []
        self.category = []
        self.image = []

    def __str__(self):
        s = ''
        s += 'Title          : ' + str(self.title) + '\n'
        s += 'Language       : ' + str(self.language) + '\n'
        s += 'Publisher name : ' + str(self.publisher_name) + '\n'
        s += 'Published year : ' + str(self.published_year) + '\n'
        s += 'ISBN           : ' + str(self.ISBN) + '\n'
        s += 'Price          : ' + str(self.price) + '\n'
        s += 'Rating point   : ' + str(self.rating_point) + '\n'
        s += 'Num of rates   : ' + str(self.num_of_rates) + '\n'
        s += 'In stocks      : ' + str(self.in_stocks) + '\n'
        s += 'Sales volume   : ' + str(self.sales_volume) + '\n'
        if not self.author == []:
            s += 'Author         : ' + self.author[0] + '\n'
            for _ in self.author[1:]:
                s += '               : ' + _ + '\n'
        if not self.category == []:
            s += 'Category       : ' + self.category[0] + '\n'
            for _ in self.category[1:]:
                s += '               : ' + _ + '\n'
        return s

    def setSingleValues(self, values):
        self.title = values[0]
        self.language = values[1]
        self.publisher_name = values[2]
        self.published_year = values[3]
        self.ISBN = values[4]
        self.price = values[5]
        self.rating_point = values[6]
        self.num_of_rates = values[7]
        self.in_stocks = values[8]
        self.sales_volume = values[9]

#################### Query Here ####################
def execute(stmt):
    #print(stmt)
    try:
        connection = psycopg2.connect(user = USER_NAME, password = PASSWORD, host = HOST, port = PORT, database = DATABASE)
        cursor = connection.cursor()
        cursor.execute(stmt)
        records = cursor.fetchall()
        connection.commit()
        cursor.close()
        return records
    except Error as e:
    	print("Error",e)

def getSingleValuesFromId(i):
    stmt = """select * from {0} where id = {1};""".format(BOOK_TABLE,1)
    return execute(stmt)

def get_author_by_id(id):
    stmt = """
        SELECT author_name
        FROM """+BOOK_AUTHOR_TABLE+""", """+AUTHOR_TABLE+"""
        WHERE book_id = """ + str(id) + """ AND bookauthor_id = """+AUTHOR_TABLE+""".id;
    """
    return [_[0] for _ in execute(stmt)]

def get_category_by_id(id):
    stmt = """
        SELECT category_name
        FROM """+BOOK_CATEGORY_TABLE+""", """+CATEGORY_TABLE+"""
        WHERE book_id = """ + str(id) + """ AND bookcategory_id = """+CATEGORY_TABLE+""".id;
    """
    return [_[0] for _ in execute(stmt)]

def get_image_by_id(id):
    stmt = """
        SELECT image
        FROM """ + IMAGE_TABLE + """
        WHERE book_id = """ + str(id) + """;
    """
    return [_[0] for _ in execute(stmt)]

def getAllBookInfo(title=None, language=None, publisher_name=None, published_year=None, ISBN=None, price=None, rating_point=None, num_of_rates=None, in_stocks=None, sales_volume=None, author=None, category=None):
    select_stmt = 'SELECT '
    from_stmt = 'FROM '
    where_stmt = 'WHERE ' 
    order_stmt = 'ORDER BY '
    info1 = [title, language, publisher_name, published_year, ISBN, price, rating_point, num_of_rates, in_stocks, sales_volume]
    #info2 = [author, category]
    bookList = []
    if True in [False if _ == None else True for _ in info1]:
        select_stmt += ' *'
        from_stmt += BOOK_TABLE
        order_stmt += 'id asc'
        if title != None:
            where_stmt += """title ILIKE '%{0}%' AND """.format(title)  
        if language != None:
            where_stmt += """language = '{0}' AND """.format(language)  
        if publisher_name != None: 
            where_stmt += """publisher_name = '{0}' AND """.format(publisher_name)  
        if published_year != None:
            where_stmt += """published_year = {0} AND """.format(published_year)  
        if ISBN != None:
            where_stmt += """"ISBN" = {0} AND """.format(ISBN)  
        if price != None:
            where_stmt += """price = {0} AND """.format(price)  
        if rating_point != None:
            where_stmt += """rating_point = {0} AND """.format(rating_point)  
        if num_of_rates != None:
            where_stmt += """num_of_rates = {0} AND """.format(num_of_rates)  
        if in_stocks != None:
            where_stmt += """in_stocks = {0} AND """.format(in_stocks)  
        if sales_volume != None:
            where_stmt += """sales_volume = {0} AND """.format(sales_volume)
        where_stmt = where_stmt[:-4] 
        statement = """{0} {1} {2} {3};""".format(select_stmt, from_stmt, where_stmt, order_stmt)
        records = execute(statement)
        for _ in records:
            newBook = Book(_[0])
            newBook.setSingleValues(_[1:])
            newBook.author = get_author_by_id(newBook.id)
            if author not in newBook.author + [None]:
                continue
            newBook.category = get_category_by_id(newBook.id)
            if category not in newBook.category + [None]:
                continue
            newBook.image = get_image_by_id(newBook.id)
            bookList.append(newBook)
    elif not author == None:
        select_stmt += 'book_id'
        from_stmt += """{0}, {1}""".format(BOOK_AUTHOR_TABLE, AUTHOR_TABLE)
        where_stmt += """ bookauthor_id = {0}.id AND author_name = '{1}'""".format(AUTHOR_TABLE, author)
        statement = """{0} {1} {2}""".format(select_stmt, from_stmt, where_stmt)
        idList = [_[0] for _ in execute(statement)]
        for _ in idList:
            newBook = Book(_)
            newBook.setSingleValues(getSingleValuesFromId(newBook.id)[0][1:])
            newBook.author = get_author_by_id(newBook.id)
            newBook.category = get_category_by_id(newBook.id)
            if category not in newBook.category + [None]:
                continue
            newBook.image = get_image_by_id(newBook.id)
            bookList.append(newBook)
    elif not category == None:
        select_stmt += 'book_id'
        from_stmt += """{0}, {1}""".format(BOOK_CATEGORY_TABLE, CATEGORY_TABLE)
        where_stmt += """ bookcategory_id = {0}.id AND category_name = '{1}'""".format(CATEGORY_TABLE, category)
        statement = """{0} {1} {2}""".format(select_stmt, from_stmt, where_stmt)
        idList = [_[0] for _ in execute(statement)]
        for _ in idList:
            newBook = Book(_)
            newBook.setSingleValues(getSingleValuesFromId(newBook.id)[0][1:])
            newBook.author = get_author_by_id(newBook.id)
            newBook.category = get_category_by_id(newBook.id)
            newBook.image = get_image_by_id(newBook.id)
            bookList.append(newBook)
    return bookList
    
def getKeyByISBN(isbn):
    stmt = '''
    SELECT key128
    FROM key_table
    WHERE "ISBN" = {0};'''.format(str(isbn))
    records = execute(stmt)
    return choice(records)[0]

def arr2str(arr):
    return reduce(lambda x, y: '{0}, {1}'.format(x,y), arr)

def booklist2str(lst):
    j = str(['''{0}"text":{1},"image":{2}{3}'''.format('{',str(_), _.image, '}') for _ in lst])
    n = len(lst)
    return '''{0}"num":{1},"book":{2}{3}'''.format('{',n, j, '}')


def arr2json(arr):
    if len(arr) == 0:
        return '[]'
    elif len(arr) == 1:
        return '["{0}"]'.format(arr[0])
    else:
        return '[' + reduce(lambda x, y: '"{0}", "{1}"'.format(x,y), arr) + ']'
def book2json(book):
    return '''{0}"Title":{2},"Language":{3},"Publisher_name":{4},"Published_year":{5},"ISBN":{6},"Price":{7},"Rating_point":{8},"Num_of_rates":{9},"In_stocks":{10},"Author":{11},"Category":{12},"Image":{13}{1}'''.format('{', '}', book.title, book.language, book.publisher_name, book.published_year, book.ISBN, book.price, book.rating_point, book.num_of_rates, book.in_stocks, arr2json(book.author), arr2json(book.category), arr2json(book.image))
def listbook2json(lst):
    l = str([book2json(_) for _ in lst])
    n = len(lst)
    return '''{0}"num":{1},"book":{2}{3}'''.format('{',n,l,'}')

#lst = getAllBookInfo(title='Artificial Intelligence')
#print(listbook2json(lst))